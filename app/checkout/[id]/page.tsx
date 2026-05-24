'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Reservation {
  id: string;
  productId: string;
  productName: string;
  warehouseId: string;
  warehouseName: string;
  quantity: number;
  expiresAt: string;
  status: string;
}

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const [reservationId, setReservationId] = useState('');

  useEffect(() => {
    params.then((unwrappedParams) => {
      setReservationId(unwrappedParams.id);
    });
  }, [params]);

  useEffect(() => {
    if (reservationId) {
      loadReservation();
    }
  }, [reservationId]);

  useEffect(() => {
    if (reservation && reservation.status === 'pending') {
      const timer = setInterval(() => {
        const expiry = new Date(reservation.expiresAt);
        const now = new Date();
        const seconds = Math.max(0, Math.floor((expiry.getTime() - now.getTime()) / 1000));
        setTimeLeft(seconds);
        
        if (seconds <= 0) {
          clearInterval(timer);
          handleExpiry();
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [reservation]);

  const loadReservation = () => {
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const found = reservations.find((r: Reservation) => r.id === reservationId);
    
    if (found && found.status === 'pending') {
      setReservation(found);
    } else if (found && found.status === 'confirmed') {
      alert('This reservation has already been confirmed!');
      router.push('/');
    } else if (found && found.status === 'released') {
      alert('This reservation has been cancelled!');
      router.push('/');
    } else {
      alert('Reservation not found or expired!');
      router.push('/');
    }
    setLoading(false);
  };

  const handleExpiry = () => {
    if (reservation && reservation.status === 'pending') {
      const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
      const updated = reservations.map((r: Reservation) =>
        r.id === reservation.id ? { ...r, status: 'released' } : r
      );
      localStorage.setItem('reservations', JSON.stringify(updated));
      alert('⏰ Reservation has expired!');
      router.push('/');
    }
  };

  const handleConfirm = async () => {
    if (!reservation) return;
    
    if (!email) {
      alert('Please enter your email address');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const updated = reservations.map((r: Reservation) =>
      r.id === reservation.id ? { ...r, status: 'confirmed' } : r
    );
    localStorage.setItem('reservations', JSON.stringify(updated));
    
    const stock = JSON.parse(localStorage.getItem('stock') || '[]');
    const updatedStock = stock.map((s: any) => {
      if (s.productId === reservation.productId && s.warehouseId === reservation.warehouseId) {
        return { ...s, available: s.available - reservation.quantity };
      }
      return s;
    });
    localStorage.setItem('stock', JSON.stringify(updatedStock));
    
    // Save order history
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push({
      id: Date.now(),
      reservationId: reservation.id,
      productName: reservation.productName,
      quantity: reservation.quantity,
      total: reservation.quantity * 99.99,
      email: email,
      date: new Date().toISOString(),
    });
    localStorage.setItem('orders', JSON.stringify(orders));
    
    setIsProcessing(false);
    alert('✅ Payment successful! Confirmation email sent to ' + email);
    router.push('/');
  };

  const handleCancel = () => {
    if (!reservation) return;
    
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const updated = reservations.map((r: Reservation) =>
      r.id === reservation.id ? { ...r, status: 'released' } : r
    );
    localStorage.setItem('reservations', JSON.stringify(updated));
    
    alert('❌ Reservation cancelled.');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8 text-center">
        <div className="animate-spin text-4xl mb-4">⏳</div>
        <div className="text-xl">Loading reservation...</div>
      </div>
    );
  }

  if (!reservation) {
    return null;
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isExpired = timeLeft <= 0;
  const productPrice = 99.99; // In real app, get from product
  const total = reservation.quantity * productPrice;

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Order Summary */}
        <div className="border rounded-lg p-6 shadow-lg">
          <h1 className="text-2xl font-bold mb-6">📋 Order Summary</h1>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between pb-3 border-b">
              <span className="text-gray-600">Product:</span>
              <span className="font-semibold">{reservation.productName}</span>
            </div>
            
            <div className="flex justify-between pb-3 border-b">
              <span className="text-gray-600">Pickup Location:</span>
              <span className="font-semibold">{reservation.warehouseName}</span>
            </div>
            
            <div className="flex justify-between pb-3 border-b">
              <span className="text-gray-600">Quantity:</span>
              <span className="font-semibold">x{reservation.quantity}</span>
            </div>
            
            <div className="flex justify-between pb-3 border-b">
              <span className="text-gray-600">Price per unit:</span>
              <span className="font-semibold">${productPrice}</span>
            </div>
            
            <div className="flex justify-between pb-3 border-b text-lg">
              <span className="font-bold">Total:</span>
              <span className="font-bold text-green-600">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Time Remaining</p>
                <p className={`text-3xl font-mono font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-green-600'}`}>
                  {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                </p>
              </div>
              <div className="text-4xl">⏰</div>
            </div>
            {timeLeft < 60 && timeLeft > 0 && (
              <p className="text-red-500 text-sm mt-2">⚠️ Hurry! Your reservation expires soon!</p>
            )}
          </div>
        </div>

        {/* Right Column - Payment Details */}
        <div className="border rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-6">💳 Payment Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border rounded-lg p-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Payment Method *</label>
              <div className="space-y-2">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span>💳 Credit/Debit Card</span>
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span>💰 PayPal</span>
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span>📱 UPI / Google Pay</span>
                </label>
              </div>
            </div>
            
            {paymentMethod === 'card' && (
              <div className="space-y-3 animate-fadeIn">
                <input
                  type="text"
                  placeholder="Card Number"
                  className="w-full border rounded-lg p-2"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="MM/YY" className="border rounded-lg p-2" />
                  <input type="text" placeholder="CVC" className="border rounded-lg p-2" />
                </div>
              </div>
            )}
            
            {paymentMethod === 'upi' && (
              <input
                type="text"
                placeholder="UPI ID (example@okhdfcbank)"
                className="w-full border rounded-lg p-2"
              />
            )}
          </div>
          
          <div className="mt-6 space-y-3">
            {!isExpired && reservation.status === 'pending' && (
              <>
                <button
                  onClick={handleConfirm}
                  disabled={isProcessing || !email}
                  className={`w-full py-3 rounded-lg font-semibold transition ${
                    isProcessing || !email
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                </button>
                <button
                  onClick={handleCancel}
                  className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition"
                >
                  Cancel Reservation
                </button>
              </>
            )}
            
            {isExpired && (
              <div className="text-center">
                <p className="text-red-500 mb-3">This reservation has expired.</p>
                <button
                  onClick={() => router.push('/')}
                  className="bg-blue-500 text-white px-6 py-2 rounded"
                >
                  Back to Products
                </button>
              </div>
            )}
          </div>
          
          <p className="text-xs text-gray-500 text-center mt-4">
            🔒 Secure payment. Your reservation is held for {minutes} minutes.
          </p>
        </div>
      </div>
    </div>
  );
}