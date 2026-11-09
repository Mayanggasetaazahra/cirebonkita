import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  CheckCircle2, 
  Truck, 
  CreditCard, 
  QrCode, 
  ArrowLeft,
  MessageCircle
} from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Keranjang, 2: Pengiriman, 3: Pembayaran, 4: Selesai
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [courier, setCourier] = useState('Kurir Reguler Desa Wisata');
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'transfer' | 'cod'>('qris');
  const [orderCode, setOrderCode] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + (item.product.harga * item.quantity), 0);
  const shippingFee = items.length > 0 ? 16000 : 0;
  const grandTotal = subtotal + shippingFee;

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) return;
    setStep(3);
  };

  const handleConfirmOrder = () => {
    const code = `INV-CRB-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderCode(code);
    setStep(4);
  };

  const handleFinish = () => {
    onClearCart();
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#014B35] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base">
                Keranjang &amp; Checkout
              </h2>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Step Indicator (matching Figma) */}
        {step !== 4 && (
          <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center justify-between text-xs">
              {/* Step 1 */}
              <div className="flex items-center gap-1.5">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step >= 1 ? 'bg-[#014B35] text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  1
                </span>
                <span className={`font-semibold ${step === 1 ? 'text-[#014B35]' : 'text-slate-600'}`}>
                  Keranjang
                </span>
              </div>
              <div className="h-0.5 flex-1 mx-2 bg-slate-200">
                <div className={`h-full transition-all ${step >= 2 ? 'bg-[#014B35]' : 'bg-transparent'}`} />
              </div>
              {/* Step 2 */}
              <div className="flex items-center gap-1.5">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step >= 2 ? 'bg-[#014B35] text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  2
                </span>
                <span className={`font-semibold ${step === 2 ? 'text-[#014B35]' : 'text-slate-600'}`}>
                  Pengiriman
                </span>
              </div>
              <div className="h-0.5 flex-1 mx-2 bg-slate-200">
                <div className={`h-full transition-all ${step >= 3 ? 'bg-[#014B35]' : 'bg-transparent'}`} />
              </div>
              {/* Step 3 */}
              <div className="flex items-center gap-1.5">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step >= 3 ? 'bg-[#014B35] text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  3
                </span>
                <span className={`font-semibold ${step === 3 ? 'text-[#014B35]' : 'text-slate-600'}`}>
                  Pembayaran
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: RINGKASAN BELANJA */}
        {step === 1 && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Ringkasan Belanja
              </h3>

              {items.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400">
                  <ShoppingBag className="w-12 h-12 stroke-1 text-slate-300 mb-2" />
                  <p className="text-xs font-semibold text-slate-600">Keranjang masih kosong</p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                    Pilih produk batik, kuliner khas, atau kerajinan tangan dari katalog UMKM Cirebon.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div 
                      key={item.product.id}
                      className="flex gap-3 p-3 rounded-xl border border-slate-200 bg-white"
                    >
                      <img 
                        src={item.product.foto} 
                        alt={item.product.nama_produk} 
                        className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-100"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-bold text-slate-900 text-xs truncate">
                            {item.product.nama_produk}
                          </h4>
                          <button 
                            type="button"
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-slate-400 hover:text-rose-500 p-0.5 transition cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[11px] text-slate-500 block">
                          Rp {item.product.harga.toLocaleString('id-ID')}
                        </span>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-slate-200 rounded-md bg-slate-50">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.product.id, -1)}
                              className="w-5 h-5 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition text-xs"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-[11px] font-bold">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.product.id, 1)}
                              disabled={item.quantity >= item.product.stok}
                              className="w-5 h-5 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition text-xs disabled:opacity-40"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-xs font-bold text-slate-900">
                            Rp {(item.product.harga * item.quantity).toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
                <div className="flex justify-between items-center text-sm font-bold text-slate-900">
                  <span>Total Harga</span>
                  <span className="text-base text-[#014B35] font-black">
                    Rp {subtotal.toLocaleString('id-ID')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#014B35] hover:bg-[#003827] text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Lanjut ke Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-200/50 transition cursor-pointer"
                >
                  Lanjut Belanja
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: INFORMASI PENGIRIMAN */}
        {step === 2 && (
          <form onSubmit={handleNextToPayment} className="flex-1 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Informasi Pengiriman
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Penerima *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama lengkap penerima"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:border-[#014B35] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor Telepon / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0812-XXXX-XXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:border-[#014B35] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Lengkap Pengiriman *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Nama jalan, nomor rumah, kelurahan, kecamatan, kota & kode pos"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:border-[#014B35] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Opsi Pengiriman
                </label>
                <select
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:border-[#014B35] outline-none bg-white"
                >
                  <option value="Kurir Reguler Desa Wisata">Kurir Reguler Desa Wisata (Rp 16.000)</option>
                  <option value="JNE Express">JNE Express (Rp 18.000)</option>
                  <option value="J&T Express">J&amp;T Express (Rp 17.500)</option>
                </select>
              </div>
            </div>

            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-2.5">
              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal Produk</span>
                  <span className="font-semibold text-slate-900">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ongkos Kirim</span>
                  <span className="font-semibold text-slate-900">Rp {shippingFee.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
                  <span>Total Tagihan</span>
                  <span className="text-[#014B35]">Rp {grandTotal.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-200/50 transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#014B35] hover:bg-[#003827] text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Lanjut ke Pembayaran</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>
        )}

        {/* STEP 3: METODE PEMBAYARAN */}
        {step === 3 && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Pilih Metode Pembayaran
              </h3>

              <div className="space-y-2.5">
                {/* Option 1: QRIS */}
                <label 
                  onClick={() => setPaymentMethod('qris')}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                    paymentMethod === 'qris'
                      ? 'border-[#014B35] bg-emerald-50/50 ring-1 ring-[#014B35]'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'qris'}
                    onChange={() => setPaymentMethod('qris')}
                    className="mt-0.5 accent-[#014B35]"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-[#014B35]" />
                      <span>QRIS Instan (GoPay, OVO, Dana, BCA Mobile)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Kode QR standar nasional otomatis diverifikasi dalam hitungan detik.
                    </p>
                  </div>
                </label>

                {/* Option 2: Transfer Bank */}
                <label 
                  onClick={() => setPaymentMethod('transfer')}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                    paymentMethod === 'transfer'
                      ? 'border-[#014B35] bg-emerald-50/50 ring-1 ring-[#014B35]'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'transfer'}
                    onChange={() => setPaymentMethod('transfer')}
                    className="mt-0.5 accent-[#014B35]"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-[#014B35]" />
                      <span>Transfer Bank (BCA / BJB / Mandiri)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Rekening Resmi Koperasi Desa Wisata Mandiri Cirebon.
                    </p>
                  </div>
                </label>

                {/* Option 3: COD */}
                <label 
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                    paymentMethod === 'cod'
                      ? 'border-[#014B35] bg-emerald-50/50 ring-1 ring-[#014B35]'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-0.5 accent-[#014B35]"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-[#014B35]" />
                      <span>Bayar di Tempat (COD Wilayah Cirebon)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Bayar saat kurir desa mengantarkan pesanan ke homestay atau alamat Anda.
                    </p>
                  </div>
                </label>
              </div>

              {/* QR Preview if QRIS */}
              {paymentMethod === 'qris' && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 block">QRIS CirebonKita</span>
                  <div className="w-36 h-36 mx-auto bg-white p-2 rounded-lg border border-slate-200 flex items-center justify-center">
                    <QrCode className="w-28 h-28 text-slate-900" />
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    NMID: ID1029384756 &bull; Koperasi Desa Cirebon
                  </span>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-2.5">
              <div className="flex justify-between items-center text-sm font-bold text-slate-900">
                <span>Total Tagihan</span>
                <span className="text-base text-[#014B35] font-black">
                  Rp {grandTotal.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-200/50 transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleConfirmOrder}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#014B35] hover:bg-[#003827] text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Konfirmasi &amp; Bayar</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: ORDER SUCCESS */}
        {step === 4 && (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#014B35] flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                Pesanan Berhasil Diajukan!
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Terima kasih atas dukungan Anda untuk UMKM lokal Desa Wisata Cirebon.
              </p>
            </div>

            <div className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Nomor Invoice:</span>
                <span className="font-mono font-bold text-slate-900">{orderCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Penerima:</span>
                <span className="font-semibold text-slate-900">{name || 'Wisatawan'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Metode:</span>
                <span className="font-semibold text-slate-900 uppercase">{paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 font-bold">
                <span className="text-slate-700">Total:</span>
                <span className="text-[#014B35]">Rp {grandTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="w-full space-y-2 pt-2">
              <a
                href={`https://wa.me/6281234567890?text=Halo%20Admin%20CirebonKita,%20saya%20sudah%20mengajukan%20pesanan%20dengan%20Kode:%20${orderCode}%20atas%20nama%20${encodeURIComponent(name)}.`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Konfirmasi via WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={handleFinish}
                className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition cursor-pointer"
              >
                Selesai &amp; Lanjut Belanja
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
