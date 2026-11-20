import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, BookOpen, CheckCircle2, Crosshair, ExternalLink, GraduationCap, MapPin, Navigation, Pencil, Route, Save, Trash2, UsersRound } from "lucide-react";
import teachers from "../data/teachers";

const emptyAddress = {
  house: "",
  street: "",
  city: "",
  state: "",
  pincode: "",
};

const haversineKm = (from, to) => {
  const radius = 6371;
  const toRadians = (value) => (value * Math.PI) / 180;
  const latitudeDelta = toRadians(to.latitude - from.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);
  const a = Math.sin(latitudeDelta / 2) ** 2 + Math.cos(toRadians(from.latitude)) * Math.cos(toRadians(to.latitude)) * Math.sin(longitudeDelta / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

function Profile() {
  const [savedLocation, setSavedLocation] = useState(null);
  const [address, setAddress] = useState(emptyAddress);
  const [status, setStatus] = useState("");
  const [gettingLocation, setGettingLocation] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState(teachers[0]?.id || null);

  useEffect(() => {
    const storedLocation = localStorage.getItem("studentLocation");
    if (!storedLocation) return;

    try {
      const parsed = JSON.parse(storedLocation);
      setSavedLocation(parsed);
      if (parsed.address) setAddress(parsed.address);
    } catch {
      localStorage.removeItem("studentLocation");
    }
  }, []);

  const saveLocation = (location) => {
    localStorage.setItem("studentLocation", JSON.stringify(location));
    setSavedLocation(location);
    setEditingAddress(false);
    setStatus("Location saved successfully.");
    window.dispatchEvent(new Event("student-location-updated"));
  };

  const removeLocation = () => {
    localStorage.removeItem("studentLocation");
    setSavedLocation(null);
    setAddress(emptyAddress);
    setEditingAddress(false);
    setStatus("Saved location removed. You can add a new address now.");
    window.dispatchEvent(new Event("student-location-updated"));
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Location services are not supported by this browser.");
      return;
    }

    setGettingLocation(true);
    setStatus("Getting your current location...");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        saveLocation({
          type: "current",
          latitude: coords.latitude,
          longitude: coords.longitude,
          address,
        });
        setGettingLocation(false);
      },
      (error) => {
        const messages = {
          1: "Location permission was denied. Please allow location access or enter your address manually.",
          2: "Your current location could not be determined.",
          3: "The location request timed out.",
        };
        setStatus(messages[error.code] || "Unable to get your current location.");
        setGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 300000 },
    );
  };

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setAddress((current) => ({ ...current, [name]: value }));
  };

  const saveManualAddress = async (event) => {
    event.preventDefault();
    const hasAddress = address.house.trim() || address.street.trim() || address.city.trim() || address.state.trim() || address.pincode.trim();
    if (!hasAddress) {
      setStatus("Enter at least one address detail.");
      return;
    }

    const fullAddress = [address.house, address.street, address.city, address.state, address.pincode, "India"]
      .filter(Boolean)
      .join(", ");

    setGeocoding(true);
    setStatus("Finding the coordinates for this address...");
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=in&q=${encodeURIComponent(fullAddress)}`, {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("Geocoding request failed");
      const results = await response.json();

      if (results.length) {
        saveLocation({
          type: "manual",
          latitude: Number(results[0].lat),
          longitude: Number(results[0].lon),
          address,
          displayName: results[0].display_name,
        });
      } else {
        saveLocation({ type: "manual", address });
        setStatus("Address saved, but exact map coordinates could not be found. Try adding the city and PIN code.");
      }
    } catch {
      saveLocation({ type: "manual", address });
      setStatus("Address saved, but the location service is unavailable. Please try again later.");
    } finally {
      setGeocoding(false);
    }
  };

  const formattedAddress = [address.house, address.street, address.city, address.state, address.pincode]
    .filter(Boolean)
    .join(", ");

  const mapSearchUrl = formattedAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formattedAddress)}`
    : "https://www.openstreetmap.org/";

  const studentCoordinates = savedLocation?.latitude != null && savedLocation?.longitude != null
    ? { latitude: savedLocation.latitude, longitude: savedLocation.longitude }
    : null;

  const teachersWithDistance = useMemo(() => teachers.map((teacher) => ({
    ...teacher,
    distanceKm: studentCoordinates ? haversineKm(studentCoordinates, teacher) : null,
  })).sort((a, b) => {
    if (a.distanceKm == null || b.distanceKm == null) return a.id - b.id;
    return a.distanceKm - b.distanceKm;
  }), [savedLocation]);

  const selectedTeacher = teachersWithDistance.find((teacher) => teacher.id === selectedTeacherId) || teachersWithDistance[0];

  const selectedDirectionsUrl = selectedTeacher
    ? studentCoordinates
      ? `https://www.google.com/maps/dir/?api=1&origin=${studentCoordinates.latitude},${studentCoordinates.longitude}&destination=${encodeURIComponent(selectedTeacher.address)}&travelmode=driving`
      : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(formattedAddress || selectedTeacher.address)}&travelmode=driving`
    : "https://www.openstreetmap.org/";

  const selectedEmbedUrl = selectedTeacher
    ? studentCoordinates
      ? `https://www.google.com/maps?saddr=${studentCoordinates.latitude},${studentCoordinates.longitude}&daddr=${selectedTeacher.latitude},${selectedTeacher.longitude}&output=embed`
      : `https://www.google.com/maps?q=${encodeURIComponent(selectedTeacher.address)}&output=embed`
    : "";

  const savedFormattedAddress = savedLocation?.address
    ? [savedLocation.address.house, savedLocation.address.street, savedLocation.address.city, savedLocation.address.state, savedLocation.address.pincode].filter(Boolean).join(", ")
    : savedLocation?.displayName || "";

  let mapUrl = "";
  if (studentCoordinates) {
    const { latitude, longitude } = studentCoordinates;
    mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.03}%2C${latitude - 0.03}%2C${longitude + 0.03}%2C${latitude + 0.03}&layer=mapnik&marker=${latitude}%2C${longitude}`;
  }

  return (
    <div className="w-full px-3 py-5 sm:px-5 sm:py-8 lg:px-8">
      <section className="card-3d scene-3d overflow-hidden rounded-3xl border border-white/10 bg-[#18181b]">
        <div className="border-b border-white/10 bg-gradient-to-r from-violet-950/70 via-[#18181b] to-sky-950/40 px-5 py-7 text-left sm:px-8 sm:py-9">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Student settings</p>
          <h1 className="m-0 text-3xl font-bold tracking-tight text-white sm:text-4xl">Set your location</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Use your current location or enter an address manually to personalize nearby learning options.
          </p>
        </div>

        <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-5 text-left">
            {savedLocation && !editingAddress ? (
              <>
              <div className="overflow-hidden rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.08]">
                <div className="border-b border-emerald-400/15 p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                      <CheckCircle2 className="size-6" />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">Location saved</p>
                      <h2 className="m-0 mt-1 text-lg font-bold text-white">Your learning address</h2>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-300">
                    {savedLocation.type === "current"
                      ? savedFormattedAddress || `Current position: ${savedLocation.latitude.toFixed(5)}, ${savedLocation.longitude.toFixed(5)}`
                      : savedFormattedAddress || "Address saved successfully"}
                  </p>
                </div>

                <div className="grid gap-3 p-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setEditingAddress(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-400/30 bg-violet-500/15 px-4 py-3 font-bold text-violet-200 transition hover:bg-violet-500/25"
                  >
                    <Pencil className="size-4" /> Change address
                  </button>
                  <button
                    type="button"
                    onClick={removeLocation}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-bold text-slate-300 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300"
                  >
                    <Trash2 className="size-4" /> Remove location
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/[0.12] to-sky-500/[0.06] p-5">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300">
                    <GraduationCap className="size-6" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-300">EduConnect nearby</p>
                    <h2 className="m-0 mt-1 text-lg font-bold text-white">Your learning community</h2>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-400">
                  Your location helps EduConnect find relevant teachers, compare nearby learning options, and provide accurate directions.
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-3 text-center">
                    <UsersRound className="mx-auto size-5 text-violet-300" />
                    <strong className="mt-2 block text-base text-white">{teachers.length}</strong>
                    <span className="text-[11px] text-slate-400">Teachers</span>
                  </div>
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-3 text-center">
                    <BadgeCheck className="mx-auto size-5 text-emerald-300" />
                    <strong className="mt-2 block text-base text-white">Verified</strong>
                    <span className="text-[11px] text-slate-400">Educators</span>
                  </div>
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-3 text-center">
                    <BookOpen className="mx-auto size-5 text-sky-300" />
                    <strong className="mt-2 block text-base text-white">Nearby</strong>
                    <span className="text-[11px] text-slate-400">Learning</span>
                  </div>
                </div>
              </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={useCurrentLocation}
                  disabled={gettingLocation}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-violet-700 px-5 py-4 text-base font-bold text-white shadow-lg shadow-violet-950/30 transition hover:-translate-y-0.5 hover:bg-violet-600 disabled:cursor-wait disabled:opacity-70"
                >
                  {gettingLocation ? <Navigation className="size-5 animate-pulse" /> : <Crosshair className="size-5" />}
                  {gettingLocation ? "Finding location..." : "Use my current location"}
                </button>

                <form onSubmit={saveManualAddress} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="mb-5 flex items-center gap-2">
                    <MapPin className="size-5 text-violet-400" />
                    <h2 className="m-0 text-lg font-bold text-white">Enter address manually</h2>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      ["house", "House / Flat number"],
                      ["street", "Street / Area"],
                      ["city", "City"],
                      ["state", "State"],
                      ["pincode", "PIN code"],
                    ].map(([name, label]) => (
                      <label key={name} className={name === "street" ? "sm:col-span-2" : "block text-sm text-slate-300"}>
                        <span className="mb-2 block font-medium">{label}</span>
                        <input
                          name={name}
                          value={address[name]}
                          onChange={handleAddressChange}
                          inputMode={name === "pincode" ? "numeric" : "text"}
                          className="w-full rounded-xl border border-white/10 bg-[#09090b] px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/20"
                        />
                      </label>
                    ))}
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {savedLocation && (
                      <button type="button" onClick={() => setEditingAddress(false)} className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-bold text-slate-300 transition hover:bg-white/10">
                        Cancel
                      </button>
                    )}
                    <button type="submit" disabled={geocoding} className={`inline-flex items-center justify-center gap-2 rounded-xl border border-violet-400/30 bg-violet-500/15 px-5 py-3 font-bold text-violet-200 transition hover:bg-violet-500/25 disabled:cursor-wait disabled:opacity-60 ${savedLocation ? "" : "sm:col-span-2"}`}>
                      <Save className="size-5" /> {geocoding ? "Finding coordinates..." : savedLocation ? "Update address" : "Save address"}
                    </button>
                  </div>
                </form>
              </>
            )}

            {status && (
              <p className={`rounded-xl border px-4 py-3 text-sm ${status.includes("successfully") || status.includes("saved") ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300" : "border-sky-400/20 bg-sky-500/10 text-sky-200"}`}>
                {status}
              </p>
            )}
          </div>

          <div className="text-left">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-300">Saved location</p>
                <p className="mt-1 text-sm text-slate-300">
                  {savedLocation?.type === "current"
                    ? `${savedLocation.latitude.toFixed(5)}, ${savedLocation.longitude.toFixed(5)}`
                    : formattedAddress || "No location saved yet"}
                </p>
              </div>
              {savedLocation && (
                <a href={mapSearchUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-violet-400/40 hover:text-violet-300">
                  Open Maps <ExternalLink className="size-4" />
                </a>
              )}
            </div>

            <div className="scene-3d relative min-h-[420px] overflow-hidden rounded-2xl border border-white/10 bg-[#09090b]">
              {selectedTeacher && (
                <iframe
                  title={`Directions from your location to ${selectedTeacher.name}`}
                  src={selectedEmbedUrl}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              )}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3">
              {teachersWithDistance.map((teacher) => (
                <button
                  key={teacher.id}
                  type="button"
                  onClick={() => setSelectedTeacherId(teacher.id)}
                  className={`rounded-2xl border p-4 text-left transition ${selectedTeacherId === teacher.id ? "border-violet-400/60 bg-violet-500/15" : "border-white/10 bg-white/[0.03] hover:border-violet-400/30"}`}
                >
                  <p className="font-bold text-white">{teacher.name}</p>
                  <p className="mt-1 text-xs text-slate-400">{teacher.location}</p>
                  <p className="mt-2 text-sm text-violet-300">{teacher.distanceKm == null ? "Distance available after location" : `Approximately ${teacher.distanceKm.toFixed(1)} km away`}</p>
                </button>
              ))}
            </div>

            <a
              href={selectedDirectionsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 py-3 font-bold text-white transition hover:bg-violet-600"
            >
              <Route className="size-5" /> Get directions to {selectedTeacher?.name}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Profile;