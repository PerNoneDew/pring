import { X, Calendar, Users, CreditCard, Hash, Clock, MapPin, Phone, Mail, User, CheckCircle, AlertCircle, Timer } from 'lucide-react';
import { Booking, EventBooking } from '../../lib/types';
import { useBooking } from '../../lib/context';
import { Badge } from '../ui/badge';

interface BookingViewModalProps {
  booking?: Booking | null;
  event?: EventBooking | null;
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  'checked-in': 'bg-green-100 text-green-800 border-green-200',
  'checked-out': 'bg-gray-100 text-gray-800 border-gray-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  completed: 'bg-gray-100 text-gray-800 border-gray-200',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatTime(timeStr: string) {
  return new Date(timeStr).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function InfoRow({ icon: Icon, label, value, color = 'text-gray-500' }: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  color?: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className={`mt-0.5 ${color}`}>
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

export function BookingViewModal({ booking, event, isOpen, onClose }: BookingViewModalProps) {
  const { services, rooms, eventRooms } = useBooking();

  if (!isOpen || (!booking && !event)) return null;

  const isEvent = !!event;
  const data = event || booking!;

  const statusLabel = data.status
    .charAt(0).toUpperCase() + data.status.slice(1).replace('-', ' ');

  const paymentMethodLabel =
    data.paymentMethod === 'counter'
      ? 'Cash at Venue'
      : data.paymentMethod
      ? data.paymentMethod.toUpperCase()
      : 'Not set';

  const serviceDetails = isEvent
    ? (event?.serviceIds || []).map((id) => services.find((s) => s.id === id)).filter(Boolean)
    : [];

  const roomDetails = isEvent
    ? (event?.selectedRooms || []).map((id) => eventRooms.find((r) => r.id === id)).filter(Boolean)
    : [];

  const roomObj = !isEvent && booking?.roomId
    ? rooms.find((r) => r.id === booking.roomId)
    : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isEvent ? 'Event Booking Details' : 'Room Booking Details'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">#{data.id}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={`${STATUS_STYLES[data.status]} border text-xs font-semibold px-3 py-1`}>
              {statusLabel}
            </Badge>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">

          {/* Guest Information */}
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Guest Information
            </h3>
            <div className="bg-gray-50 rounded-xl px-4 divide-y divide-gray-100">
              <InfoRow icon={User} label="Full Name" value={data.guestName} color="text-blue-500" />
              <InfoRow icon={Mail} label="Email Address" value={data.guestEmail} color="text-blue-500" />
              <InfoRow icon={Phone} label="Phone Number" value={data.guestPhone || '—'} color="text-blue-500" />
              <InfoRow icon={Users} label="Number of Guests" value={`${data.numberOfGuests} guest${data.numberOfGuests > 1 ? 's' : ''}`} color="text-blue-500" />
            </div>
          </section>

          {/* Booking Details */}
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              {isEvent ? 'Event Details' : 'Room Details'}
            </h3>
            <div className="bg-gray-50 rounded-xl px-4 divide-y divide-gray-100">
              {isEvent ? (
                <>
                  <InfoRow
                    icon={MapPin}
                    label="Event Type"
                    value={(event!.eventType.charAt(0).toUpperCase() + event!.eventType.slice(1)) + ' Event'}
                    color="text-amber-500"
                  />
                  {event!.eventName && (
                    <InfoRow icon={Hash} label="Event Name" value={event!.eventName} color="text-amber-500" />
                  )}
                  <InfoRow
                    icon={Calendar}
                    label="Event Start Date"
                    value={formatDate(event!.eventDate)}
                    color="text-amber-500"
                  />
                  <InfoRow
                    icon={Calendar}
                    label="Event End Date"
                    value={formatDate(event!.eventEndDate)}
                    color="text-amber-500"
                  />
                </>
              ) : (
                <>
                  <InfoRow
                    icon={MapPin}
                    label="Room"
                    value={`Room ${booking!.roomNumber}${roomObj ? ` — ${roomObj.type.charAt(0).toUpperCase() + roomObj.type.slice(1)}` : ''}`}
                    color="text-amber-500"
                  />
                  <InfoRow
                    icon={Calendar}
                    label="Check-in Date"
                    value={
                      <span>
                        {formatDate(booking!.checkInDate)}
                        {booking!.checkInTime && (
                          <span className="text-gray-400 font-normal"> at {formatTime(booking!.checkInTime)}</span>
                        )}
                      </span>
                    }
                    color="text-green-500"
                  />
                  <InfoRow
                    icon={Calendar}
                    label="Check-out Date"
                    value={
                      <span>
                        {formatDate(booking!.checkOutDate)}
                        {booking!.checkOutTime && (
                          <span className="text-gray-400 font-normal"> at {formatTime(booking!.checkOutTime)}</span>
                        )}
                      </span>
                    }
                    color="text-red-500"
                  />
                  {(() => {
                    const nights = Math.max(
                      1,
                      Math.round(
                        (new Date(booking!.checkOutDate).getTime() -
                          new Date(booking!.checkInDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )
                    );
                    return (
                      <InfoRow icon={Timer} label="Duration" value={`${nights} night${nights > 1 ? 's' : ''}`} color="text-amber-500" />
                    );
                  })()}
                </>
              )}
            </div>
          </section>

          {/* Event Rooms */}
          {isEvent && roomDetails.length > 0 && (
            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                Reserved Rooms
              </h3>
              <div className="bg-gray-50 rounded-xl px-4 divide-y divide-gray-100">
                {roomDetails.map((room, i) => (
                  <InfoRow key={i} icon={MapPin} label={`Room ${i + 1}`} value={(room as any).roomNumber || (room as any).name} color="text-amber-500" />
                ))}
              </div>
            </section>
          )}

          {/* Services */}
          {serviceDetails.length > 0 && (
            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                Services & Add-ons
              </h3>
              <div className="bg-gray-50 rounded-xl divide-y divide-gray-100">
                {serviceDetails.map((svc, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm font-semibold text-gray-800">{(svc as any).name}</span>
                    <span className="text-sm font-bold text-gray-700">₱{((svc as any).price as number).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Payment Summary */}
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Payment Summary
            </h3>
            <div className="bg-gray-50 rounded-xl px-4 divide-y divide-gray-100">
              <InfoRow
                icon={CreditCard}
                label="Payment Method"
                value={paymentMethodLabel}
                color="text-emerald-500"
              />
              {data.paymentReference && (
                <InfoRow icon={Hash} label="Reference Number" value={data.paymentReference} color="text-emerald-500" />
              )}
              <InfoRow
                icon={data.paymentStatus === 'completed' ? CheckCircle : AlertCircle}
                label="Payment Status"
                value={
                  <span className={
                    data.paymentStatus === 'completed' ? 'text-green-600' :
                    data.paymentStatus === 'cancelled' ? 'text-red-600' :
                    'text-yellow-600'
                  }>
                    {(data.paymentStatus || 'pending').toUpperCase()}
                  </span>
                }
                color={data.paymentStatus === 'completed' ? 'text-green-500' : 'text-yellow-500'}
              />
            </div>
          </section>

          {/* Total */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-5 flex items-center justify-between">
            <span className="text-white font-semibold text-sm">Total Amount</span>
            <span className="text-white font-bold text-2xl">₱{data.totalPrice.toFixed(2)}</span>
          </div>

          {/* Booking created date */}
          <p className="text-center text-xs text-gray-400">
            Booking placed on {new Date(data.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
}
