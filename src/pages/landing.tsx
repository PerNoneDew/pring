import { useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBooking } from '../lib/context';
import { BedDouble, Users, Wifi, Wind, Tv, Star, ArrowRight, LogOut } from 'lucide-react';

const HERO_BG = 'https://images.pexels.com/photos/7507131/pexels-photo-7507131.jpeg?auto=compress&cs=tinysrgb&h=1280&w=1920';

const ROOM_IMAGES = [
  'https://images.pexels.com/photos/6434592/pexels-photo-6434592.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/2736384/pexels-photo-2736384.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/8082217/pexels-photo-8082217.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/13813465/pexels-photo-13813465.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/6466484/pexels-photo-6466484.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/97083/pexels-photo-97083.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
];

const TYPE_LABELS: Record<string, string> = {
  single: 'Single',
  double: 'Double',
  suite: 'Suite',
};

const TYPE_BADGE_COLORS: Record<string, string> = {
  single: 'bg-white text-gray-800',
  double: 'bg-white text-gray-800',
  suite: 'bg-red-500 text-white',
};

function amenityIcon(amenity: string) {
  const lower = amenity.toLowerCase();
  if (lower.includes('wifi') || lower.includes('wi-fi')) return <Wifi size={13} />;
  if (lower.includes('air') || lower.includes('ac')) return <Wind size={13} />;
  if (lower.includes('tv') || lower.includes('television')) return <Tv size={13} />;
  return null;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout, rooms } = useBooking();
  const roomsRef = useRef<HTMLDivElement>(null);

  const availableRooms = rooms.filter((r) => r.status === 'available' || r.status === 'reserved');

  const handleExploreRooms = () => {
    roomsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleViewBook = () => {
    if (isAuthenticated && currentUser.role === 'customer') {
      navigate('/customer');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const displayName = currentUser.firstName
    ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim()
    : currentUser.name || currentUser.email;

  const roomTypes = [...new Set(rooms.map((r) => r.type))].length || 3;

  return (
    <div className="min-h-screen bg-[#f5f0eb] font-sans">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-serif text-xl font-bold text-gray-900 tracking-tight">
            <BedDouble size={22} className="text-amber-800" />
            Pring Kuya's Inn
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600 font-medium">
            <button
              onClick={handleExploreRooms}
              className="hover:text-gray-900 transition-colors"
            >
              Rooms
            </button>
            {isAuthenticated && currentUser.role === 'customer' && (
              <Link to="/customer/my-bookings" className="hover:text-gray-900 transition-colors">
                My Bookings
              </Link>
            )}
            {isAuthenticated && currentUser.role === 'admin' && (
              <Link to="/admin" className="hover:text-gray-900 transition-colors">
                Admin Dashboard
              </Link>
            )}
            {isAuthenticated && currentUser.role === 'staff' && (
              <Link to="/staff" className="hover:text-gray-900 transition-colors">
                Staff Portal
              </Link>
            )}
          </nav>

          {/* Auth buttons / user */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {displayName}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors"
                >
                  <LogOut size={15} />
                  <span className="hidden sm:block">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-semibold bg-amber-900 text-white px-4 py-2 rounded-lg hover:bg-amber-800 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section
        className="relative h-[580px] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/62" />
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          {/* Stars */}
          <div className="flex justify-center gap-1.5 mb-5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} className="fill-amber-400 text-amber-400" />
            ))}
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold text-white leading-tight mb-5">
            Your Perfect Stay<br />Awaits
          </h1>
          <p className="text-gray-200 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Discover our collection of beautifully appointed rooms and suites, crafted for the discerning traveler.
          </p>
          <button
            onClick={handleExploreRooms}
            className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Explore Rooms
          </button>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-3 divide-x divide-gray-200 text-center">
          <div className="px-6">
            <p className="text-4xl font-bold text-gray-900">{roomTypes}</p>
            <p className="text-sm text-gray-500 mt-1">Room Types</p>
          </div>
          <div className="px-6">
            <p className="text-4xl font-bold text-gray-900">100%</p>
            <p className="text-sm text-gray-500 mt-1">Guest Satisfaction</p>
          </div>
          <div className="px-6">
            <p className="text-4xl font-bold text-gray-900">24/7</p>
            <p className="text-sm text-gray-500 mt-1">Concierge Service</p>
          </div>
        </div>
      </section>

      {/* ── Rooms ── */}
      <section ref={roomsRef} className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-10">
          <h2 className="font-serif text-4xl font-bold text-gray-900 mb-3">Our Rooms &amp; Suites</h2>
          <p className="text-gray-500 max-w-lg leading-relaxed">
            From cozy standard rooms to lavish suites — find the perfect space for your stay.
          </p>
        </div>

        {availableRooms.length === 0 ? (
          <div className="text-center py-24 text-gray-400 text-lg">No rooms available at the moment.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {availableRooms.map((room, idx) => {
              const imgSrc = room.image || ROOM_IMAGES[idx % ROOM_IMAGES.length];
              const visibleAmenities = room.amenities.slice(0, 3);
              const extraCount = room.amenities.length - 3;

              return (
                <div
                  key={room.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={imgSrc}
                      alt={`Room ${room.roomNumber}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <span
                      className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full ${TYPE_BADGE_COLORS[room.type] || 'bg-white text-gray-800'}`}
                    >
                      {TYPE_LABELS[room.type] || room.type}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-serif text-lg font-bold text-gray-900 leading-snug">
                        Room {room.roomNumber}
                      </h3>
                      <div className="text-right flex-shrink-0 ml-3">
                        <span className="text-xl font-bold text-gray-900">
                          ₱{room.pricePerNight.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400 block">/night</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 mb-3 leading-relaxed line-clamp-2">
                      {TYPE_LABELS[room.type]} room — a comfortable stay with all essential amenities for up to {room.capacity} guest{room.capacity !== 1 ? 's' : ''}.
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                      <Users size={13} />
                      <span>Up to {room.capacity} guest{room.capacity !== 1 ? 's' : ''}</span>
                    </div>

                    {room.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {visibleAmenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full"
                          >
                            {amenityIcon(amenity)}
                            {amenity}
                          </span>
                        ))}
                        {extraCount > 0 && (
                          <span className="text-xs text-gray-400 self-center">+{extraCount} more</span>
                        )}
                      </div>
                    )}

                    <div className="mt-auto">
                      <button
                        onClick={handleViewBook}
                        className="w-full flex items-center justify-center gap-2 bg-amber-900 hover:bg-amber-800 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
                      >
                        View &amp; Book
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Pring Kuya's Inn. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
