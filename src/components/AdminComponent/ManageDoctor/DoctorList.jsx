import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Search, User, Mail, Phone, Stethoscope, DollarSign, Eye, EyeOff } from 'lucide-react';
import { GlassCard, GlassButton, GlassInput } from '../../common';
import toast from 'react-hot-toast';

// Dummy data for demonstration - backend integration can be done later
const DUMMY_DOCTORS = [
  {
    _id: '1',
    loginId: 'DOC001',
    name: 'Dr. John Smith',
    email: 'john.smith@hospital.com',
    phone: '+1234567890',
    specialization: 'Cardiology',
    experience: '10 years',
    education: 'MD, Harvard Medical School',
    consultationFee: 500,
    available: true,
    profilePicture: null
  },
  {
    _id: '2',
    loginId: 'DOC002',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@hospital.com',
    phone: '+1234567891',
    specialization: 'Neurology',
    experience: '8 years',
    education: 'MD, Johns Hopkins',
    consultationFee: 600,
    available: false,
    profilePicture: null
  },
  {
    _id: '3',
    loginId: 'DOC003',
    name: 'Dr. Michael Brown',
    email: 'michael.brown@hospital.com',
    phone: '+1234567892',
    specialization: 'Orthopedics',
    experience: '12 years',
    education: 'MD, Mayo Clinic',
    consultationFee: 450,
    available: true,
    profilePicture: null
  }
];

const DoctorList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [doctors, setDoctors] = useState(DUMMY_DOCTORS); // Using dummy data
  const dispatch = useDispatch();
  
  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.loginId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle doctor availability
  const toggleAvailability = (doctorId) => {
    setDoctors(prevDoctors =>
      prevDoctors.map(doctor =>
        doctor._id === doctorId
          ? { ...doctor, available: !doctor.available }
          : doctor
      )
    );
    
    const doctor = doctors.find(d => d._id === doctorId);
    toast.success(`Dr. ${doctor.name} is now ${doctor.available ? 'unavailable' : 'available'}`);
  };

  return (
    <GlassCard className="animate-fadeInUp">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Doctor List</h2>
        <p className="text-gray-600">Manage doctor availability and view details</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <GlassInput
          icon={Search}
          label="Search Doctors"
          type="text"
          placeholder="Search by name, ID, or specialization..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor, index) => (
          <GlassCard 
            key={doctor._id} 
            className={`hover-lift animate-fadeInUp animate-stagger-${(index % 3) + 1}`}
            background="glass-card"
          >
            <div className="text-center mb-4">
              {/* Profile Picture */}
              <div className="w-20 h-20 mx-auto mb-3 rounded-full border-4 border-blue-100 overflow-hidden bg-gray-100 flex items-center justify-center">
                {doctor.profilePicture ? (
                  <img 
                    src={doctor.profilePicture} 
                    alt={doctor.name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <User className="w-10 h-10 text-gray-400" />
                )}
              </div>
              
              {/* Doctor Name and ID */}
              <h3 className="text-lg font-bold text-gray-800">{doctor.name}</h3>
              <p className="text-sm text-gray-500 mb-2">ID: {doctor.loginId}</p>
              
              {/* Availability Badge */}
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                doctor.available 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {doctor.available ? 'Available' : 'Unavailable'}
              </div>
            </div>

            {/* Doctor Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                <span className="truncate">{doctor.email}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                <span>{doctor.phone}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <Stethoscope className="w-4 h-4 mr-2 text-gray-400" />
                <span>{doctor.specialization}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                <span>₹{doctor.consultationFee}</span>
              </div>
            </div>

            {/* Additional Info */}
            <div className="text-xs text-gray-500 mb-4">
              <p><strong>Experience:</strong> {doctor.experience}</p>
              <p><strong>Education:</strong> {doctor.education}</p>
            </div>

            {/* Toggle Availability Button */}
            <GlassButton
              onClick={() => toggleAvailability(doctor._id)}
              variant={doctor.available ? "danger" : "success"}
              size="sm"
              className={`w-full ${
                doctor.available 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {doctor.available ? (
                <>
                  <EyeOff size={16} />
                  Mark Unavailable
                </>
              ) : (
                <>
                  <Eye size={16} />
                  Mark Available
                </>
              )}
            </GlassButton>
          </GlassCard>
        ))}
      </div>

      {/* No Results */}
      {filteredDoctors.length === 0 && (
        <div className="text-center py-8">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No doctors found</p>
          <p className="text-gray-400">Try adjusting your search criteria</p>
        </div>
      )}
    </GlassCard>
  );
};

export default DoctorList;