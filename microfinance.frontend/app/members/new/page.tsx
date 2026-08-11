'use client';
import { SearchableSelect } from '../../../components/ui/SearchableSelect';

import { toast } from '../../utils/toast';

import React, { useState } from 'react';
import { useMicrofinance } from '../../context/MicrofinanceContext';
import { useRouter } from 'next/navigation';
import {
  UserPlus,
  Camera,
  Fingerprint,
  FileSignature,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Upload,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import Link from 'next/link';
import { FingerprintScannerModal } from '../../components/ui/FingerprintScannerModal';

export default function NewMemberWizard() {
  const { branches, registerMember, createSavingsAccount, products } = useMicrofinance();
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [dob, setDob] = useState('1990-01-01');
  const [nidNumber, setNidNumber] = useState('');
  const [phone, setPhone] = useState('+880 ');
  const [address, setAddress] = useState('');
  const [branchId, setBranchId] = useState(branches[0]?.id || 'BR-001');
  
  // Biometric & Media Simulations
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [fingerprintEnrolled, setFingerprintEnrolled] = useState(false);
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [signatureDone, setSignatureDone] = useState(false);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80');
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Nominee State
  const [nomineeName, setNomineeName] = useState('');
  const [nomineeRelation, setNomineeRelation] = useState('Spouse');
  const [nomineeNid, setNomineeNid] = useState('');
  const [nomineePhone, setNomineePhone] = useState('+880 ');
  const [initialDeposit, setInitialDeposit] = useState(500);
  const [selectedSavingsProduct, setSelectedSavingsProduct] = useState(products.savings[0]?.id || 'PROD-SVG-01');

  const handleSimulatePhoto = () => {
    setPhotoCaptured(true);
    setPhotoUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80');
  };

  const handleSimulateFingerprint = () => {
    setShowBiometricModal(true);
  };

  const handleSimulateSignature = () => {
    setSignatureDone(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !nidNumber || !nomineeName) {
      toast.error('Please fill in all mandatory KYC and Nominee fields.');
      return;
    }

    const formData = new FormData();
    formData.append('FirstName', firstName);
    formData.append('LastName', lastName);
    formData.append('Gender', gender);
    formData.append('Dob', dob);
    formData.append('NidNumber', nidNumber);
    formData.append('Phone', phone);
    formData.append('Address', address);
    formData.append('BranchId', branchId);
    formData.append('FingerprintEnrolled', fingerprintEnrolled.toString());
    
    // Nominee data
    formData.append('NomineeName', nomineeName);
    formData.append('NomineeRelationship', nomineeRelation);
    formData.append('NomineeNidNumber', nomineeNid || 'N/A');
    formData.append('NomineePhone', nomineePhone);
    formData.append('NomineeSharePercentage', '100');

    if (photoFile) {
      formData.append('Photo', photoFile);
    }
    if (signatureFile) {
      formData.append('Signature', signatureFile);
    }

    try {
      const newMember = await registerMember(formData);

      // Simultaneously open their initial mandatory General Savings account!
      createSavingsAccount(newMember.id, branchId, selectedSavingsProduct, initialDeposit);

      toast.success(`Successfully enrolled Member ${newMember.firstName} with mandatory initial Savings Account & Biometric profile!`);
      router.push(`/members/`);
    } catch (err) {
      toast.error('Failed to register member.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Back link & Title */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <Link href="/members" className="text-xs font-bold text-slate-400 hover:text-emerald-500 flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Member Directory</span>
          </Link>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">
            Digital Onboarding & KYC Enrollment Wizard
          </h1>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Capture member KYC data, NID reference, specimen signature, live optical fingerprint, and mandatory initial savings deposit.
          </p>
        </div>
      </div>

      {/* Step Progress indicators */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { num: 1, title: 'Member Profile & NID Details' },
          { num: 2, title: 'Biometrics, Photo & Signature' },
          { num: 3, title: 'Nominee Profile & Opening Deposit' },
        ].map((s) => (
          <div
            key={s.num}
            onClick={() => setStep(s.num as 1 | 2 | 3)}
            className={`p-4 rounded-2xl border transition cursor-pointer flex items-center gap-3 ${
              step === s.num
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400 shadow-md'
                : 'bg-slate-100/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-400'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
              step === s.num ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
            }`}>
              {s.num}
            </div>
            <p className="text-xs font-bold leading-tight">{s.title}</p>
          </div>
        ))}
      </div>

      {/* Wizard Form Container */}
      <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8 border border-slate-200 dark:border-slate-800 space-y-6">
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <span>Step 1: Primary Personal Information (NID Verified)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Mohammad"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Rahman"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">National ID (NID) Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 19885672349012"
                  value={nidNumber}
                  onChange={(e) => setNidNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Mobile Contact *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Gender *</label>
                <SearchableSelect
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other / Diverse</option>
                </SearchableSelect>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Date of Birth *</label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Operating Branch Assignment *</label>
                <SearchableSelect
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>{b.code} - {b.name}</option>
                  ))}
                </SearchableSelect>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Residential Address *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Village, Post Office, Thana & District..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition"
              >
                Continue to Biometric Capture â†’
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <span>Step 2: Live Biometric Enrollment & Specimen Capture</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {/* Photo Capture Simulator */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-between space-y-4">
                <div>
                  <Camera className="w-8 h-8 text-emerald-500 mx-auto" />
                  <h4 className="font-bold text-sm mt-2 text-slate-800 dark:text-slate-100">Live Webcam Snapshot</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Upload member photo</p>
                </div>
                
                {photoFile ? (
                  <div className="relative">
                    <img src={URL.createObjectURL(photoFile)} alt="Captured" className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-500 mx-auto" />
                    <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full mt-2 inline-block">Selected</span>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400 text-xs mx-auto overflow-hidden">
                    <img src={photoUrl} className="w-full h-full object-cover opacity-50" alt="" />
                  </div>
                )}

                <label className="w-full py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-emerald-500 hover:text-white text-xs font-bold transition cursor-pointer text-center block">
                  {photoFile ? 'Change Photo' : 'Upload Photo'}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setPhotoFile(e.target.files[0]);
                      setPhotoCaptured(true);
                    }
                  }} />
                </label>
              </div>

              {/* Fingerprint Scanner Simulator */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-between space-y-4">
                <div>
                  <Fingerprint className="w-8 h-8 text-teal-500 mx-auto" />
                  <h4 className="font-bold text-sm mt-2 text-slate-800 dark:text-slate-100">Optical Thumb Scanner</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Enroll right and left thumb ridges for mandatory withdrawal check.</p>
                </div>

                {fingerprintEnrolled ? (
                  <div className="p-4 rounded-full bg-emerald-500/20 text-emerald-500">
                    <CheckCircle2 className="w-16 h-16" />
                    <p className="text-[10px] font-black mt-2 bg-emerald-600 text-white px-2 py-0.5 rounded-full">ENROLLED</p>
                  </div>
                ) : (
                  <div className="p-4 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-400">
                    <Fingerprint className="w-16 h-16 opacity-50 animate-pulse" />
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSimulateFingerprint}
                  className="w-full py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-teal-500 hover:text-white text-xs font-bold transition"
                >
                  {fingerprintEnrolled ? 'Biometrics Enrolled' : 'Simulate Sensor Tap'}
                </button>
              </div>

              {/* Specimen Signature Simulator */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-between space-y-4">
                <div>
                  <FileSignature className="w-8 h-8 text-amber-500 mx-auto" />
                  <h4 className="font-bold text-sm mt-2 text-slate-800 dark:text-slate-100">Digital Signature Pad</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Upload signature image</p>
                </div>

                {signatureFile ? (
                  <div className="p-2 border border-emerald-500 rounded-xl bg-white text-slate-800 text-xs font-mono font-bold">
                    [File: {signatureFile.name}]
                  </div>
                ) : (
                  <div className="w-full h-16 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400 text-xs">
                    Upload Image
                  </div>
                )}

                <label className="w-full py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-amber-500 hover:text-white text-xs font-bold transition cursor-pointer text-center block">
                  {signatureFile ? 'Change Signature' : 'Upload Signature'}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSignatureFile(e.target.files[0]);
                      setSignatureDone(true);
                    }
                  }} />
                </label>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs text-slate-600 dark:text-slate-300"
              >
                â† Back to Personal Info
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition"
              >
                Continue to Nominee & Deposit â†’
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <span>Step 3: Nominee Reference & Initial Savings Opening Deposit</span>
            </h3>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-medium">
              Every NGO microfinance member is required to maintain at least one General Savings account upon onboarding. This initial deposit will be collected at the teller counter immediately.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nominee Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Farzana Begum"
                  value={nomineeName}
                  onChange={(e) => setNomineeName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Relationship with Member *</label>
                <SearchableSelect
                  value={nomineeRelation}
                  onChange={(e) => setNomineeRelation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                >
                  <option value="Spouse (Wife/Husband)">Spouse (Wife / Husband)</option>
                  <option value="Son/Daughter">Son / Daughter</option>
                  <option value="Father/Mother">Father / Mother</option>
                  <option value="Brother/Sister">Brother / Sister</option>
                </SearchableSelect>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nominee NID Number</label>
                <input
                  type="text"
                  placeholder="Optional NID reference..."
                  value={nomineeNid}
                  onChange={(e) => setNomineeNid(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nominee Contact Phone *</label>
                <input
                  type="text"
                  required
                  value={nomineePhone}
                  onChange={(e) => setNomineePhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold"
                />
              </div>

              <div className="pt-3 md:col-span-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Opening Savings Product Scheme *</label>
                  <SearchableSelect
                    value={selectedSavingsProduct}
                    onChange={(e) => setSelectedSavingsProduct(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-emerald-600 dark:text-emerald-400"
                  >
                    {products.savings.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} ({s.interestRate}% Interest)</option>
                    ))}
                  </SearchableSelect>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Initial Cash Deposit (à§³) *</label>
                  <input
                    type="number"
                    min={100}
                    required
                    value={initialDeposit}
                    onChange={(e) => setInitialDeposit(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono font-black text-emerald-600 dark:text-emerald-400"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs text-slate-600 dark:text-slate-300"
              >
                â† Back to Biometrics
              </button>
              <button
                type="submit"
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm shadow-xl shadow-emerald-500/30 hover:opacity-95 transition"
              >
                Complete Enrollment & Generate Passbook â†’
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Biometric Verification Modal Simulator */}
      <FingerprintScannerModal
        isOpen={showBiometricModal}
        memberName={`${firstName} ${lastName}`}
        memberNid={nidNumber}
        onSuccess={() => {
          setFingerprintEnrolled(true);
          setShowBiometricModal(false);
        }}
        onCancel={() => setShowBiometricModal(false)}
      />
    </div>
  );
}


