import { useState } from 'react';
import { Search, UserPlus, Pencil, Save, Phone, Mail, Info, Calendar, HeartPulse, AlertCircle, User } from 'lucide-react';
import { patientService } from '../../services/patientService';
import { GlassCard, GlassButton, GlassInput } from '../common';
import toast from 'react-hot-toast';

const initialForm = {
  name: '',
  phone: '',
  age: '',
  email: '',
  gender: 'other',
  medicalHistory: '',
  emergencyContact: {
    name: '',
    phone: ''
  }
};

const PatientManager = () => {
  const [phone, setPhone] = useState('');
  const [patient, setPatient] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [notFound, setNotFound] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await patientService.searchPatientByIdOrPhone({ phone: phone.trim() });

      if (response?.data[0]) {
        const data = response.data[0];
        setPatient(data);
        setFormData({
          ...data,
          emergencyContact: {
            name: data.emergencyContact?.name || '',
            phone: data.emergencyContact?.phone || ''
          }
        });
        setNotFound(false);
        setShowRegisterForm(false);
        setEditMode(false);
        toast.success('Patient found successfully!');
      } else {
        console.log("Patient not found");
        setNotFound(true);
        setShowRegisterForm(true);
        setPatient(null);
        setFormData({ ...initialForm, phone });
        toast.error('Patient not found. Please register them.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error searching for patient');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('emergencyContact.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEditSave = async () => {
    setIsLoading(true);
    try {
      const updated = await patientService.updatePatient(patient._id, formData);
      if (updated?.data) {
        setPatient(null);
        setFormData(initialForm);
        setEditMode(false);
        setShowRegisterForm(false);
        setNotFound(false);
        toast.success('Patient updated successfully!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update patient');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const response = await patientService.createOrFindPatient(formData);
      if (response?.data) {
        setPatient(null);
        setFormData(initialForm);
        setShowRegisterForm(false);
        setNotFound(false);
        setPhone('');
        toast.success('Patient registered successfully!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to register patient');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Background */}
      <div className="absolute inset-0 gradient-receptionist opacity-5"></div>
      
      <div className="relative z-10 p-6">
        <GlassCard className="max-w-4xl mx-auto animate-fadeInUp">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Patient Management</h2>
            <p className="text-gray-600">Search, register, and manage patient information</p>
          </div>

          {/* Search Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <GlassInput
                  icon={Search}
                  label="Search Patient"
                  type="text"
                  placeholder="Enter phone number to search"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="flex gap-2 items-end">
                <GlassButton
                  onClick={handleSearch}
                  loading={isLoading}
                  className="gradient-receptionist text-white"
                  disabled={!phone.trim()}
                >
                  <Search size={18} />
                  Search
                </GlassButton>
                <GlassButton
                  onClick={() => {
                    setFormData(initialForm);
                    setPatient(null);
                    setEditMode(false);
                    setShowRegisterForm(true);
                    setNotFound(false);
                  }}
                  variant="success"
                  className="bg-green-500 text-white"
                >
                  <UserPlus size={18} />
                  Register
                </GlassButton>
              </div>
            </div>

            {notFound && (
              <div className="mt-4 flex items-center gap-2 text-red-600 font-medium">
                <AlertCircle size={20} />
                Patient not found. Please register them below.
              </div>
            )}
          </div>

          {/* Patient Details View */}
          {patient && !editMode && (
            <GlassCard className="mb-6 animate-fadeInUp animate-stagger-2" background="glass">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-emerald-600" />
                  Patient Details
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <InfoRow icon={<Info />} label="Patient ID" value={patient.patientId} />
                <InfoRow icon={<User />} label="Name" value={patient.name} />
                <InfoRow icon={<Phone />} label="Phone" value={patient.phone} />
                <InfoRow icon={<Mail />} label="Email" value={patient.email} />
                <InfoRow icon={<Calendar />} label="Age" value={patient.age} />
                <InfoRow icon={<Info />} label="Gender" value={patient.gender} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <InfoRow 
                  icon={<HeartPulse />} 
                  label="Medical History" 
                  value={patient.medicalHistory || 'No medical history recorded'} 
                />
                <InfoRow
                  icon={<Phone />}
                  label="Emergency Contact"
                  value={`${patient.emergencyContact?.name || 'Not provided'} - ${patient.emergencyContact?.phone || 'Not provided'}`}
                />
              </div>

              <GlassButton
                onClick={() => {
                  setEditMode(true);
                  setFormData({
                    ...patient,
                    emergencyContact: {
                      name: patient.emergencyContact?.name || '',
                      phone: patient.emergencyContact?.phone || ''
                    }
                  });
                }}
                variant="warning"
                className="bg-yellow-500 text-white"
              >
                <Pencil size={18} />
                Edit Patient
              </GlassButton>
            </GlassCard>
          )}

          {/* Register or Edit Form */}
          {(editMode || showRegisterForm) && (
            <PatientForm
              formData={formData}
              handleChange={handleChange}
              onSubmit={editMode ? handleEditSave : handleRegister}
              submitText={editMode ? 'Save Changes' : 'Register Patient'}
              icon={editMode ? <Save /> : <UserPlus />}
              isLoading={isLoading}
            />
          )}
        </GlassCard>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
    <div className="text-emerald-600 mt-1">{icon}</div>
    <div className="flex-1">
      <span className="text-sm font-medium text-gray-600 block">{label}</span>
      <span className="text-gray-800">{value || 'Not provided'}</span>
    </div>
  </div>
);

const PatientForm = ({ formData, handleChange, onSubmit, submitText, icon, isLoading }) => (
  <GlassCard className="animate-fadeInUp animate-stagger-3" background="glass">
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
        {icon}
        <span className="ml-2">{submitText}</span>
      </h3>
      <p className="text-gray-600">Fill in the patient information below</p>
    </div>

    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit();
    }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassInput
          icon={User}
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter patient's full name"
          required
        />
        <GlassInput
          icon={Phone}
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter contact number"
          required
        />
        <GlassInput
          icon={Mail}
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email address"
          required
        />
        <GlassInput
          icon={Calendar}
          label="Age"
          name="age"
          type="number"
          value={formData.age}
          onChange={handleChange}
          placeholder="Enter age"
          required
        />
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-4 py-3 input-glass rounded-xl border border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/80"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Medical History</label>
          <textarea
            name="medicalHistory"
            value={formData.medicalHistory}
            onChange={handleChange}
            placeholder="Enter medical history (optional)"
            rows="3"
            className="w-full px-4 py-3 input-glass rounded-xl border border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/80"
          />
        </div>

        <GlassInput
          icon={User}
          label="Emergency Contact Name"
          name="emergencyContact.name"
          value={formData.emergencyContact.name}
          onChange={handleChange}
          placeholder="Emergency contact name"
        />
        <GlassInput
          icon={Phone}
          label="Emergency Contact Phone"
          name="emergencyContact.phone"
          value={formData.emergencyContact.phone}
          onChange={handleChange}
          placeholder="Emergency contact phone"
        />
      </div>

      <div className="flex justify-end pt-4">
        <GlassButton
          type="submit"
          variant="success"
          size="lg"
          loading={isLoading}
          className="gradient-receptionist text-white"
        >
          {icon}
          {submitText}
        </GlassButton>
      </div>
    </form>
  </GlassCard>
);

export default PatientManager;