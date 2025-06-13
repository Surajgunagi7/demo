import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { User, Mail, Phone, Stethoscope, Edit2, Save, Camera, GraduationCap, DollarSign } from "lucide-react";
import { doctorService } from "../../services/adminDashboardService";
import { authService } from "../../services/authService";
import { GlassCard, GlassButton, GlassInput, LoadingOverlay } from "../common";
import toast from 'react-hot-toast';

const DoctorProfile = () => {
  const { register, handleSubmit, reset } = useForm();
  const [editMode, setEditMode] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        setIsLoading(true);
        const res = await authService.getUserProfile();
        setDoctor(res.data);
        setPreviewUrl(res.data.profilePicture || null);
        reset({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          specialization: res.data.specialization || "",
          experience: res.data.experience || "",
          education: res.data.education || "",
          consultationFee: res.data.consultationFee || "",
        });
      } catch (error) {
        console.error("Error fetching doctor profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [reset]);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (data) => {
    try {
      setIsLoading(true);
      const updatedData = {
        ...data,
        consultationFee: parseFloat(data.consultationFee),
        profilePicture: previewUrl,
      };
      
      const updated = await doctorService.updateDoctor(doctor._id, updatedData);
      setDoctor(updated.data); 
      setEditMode(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const InputField = ({ icon: Icon, label, name, type = "text", disabled = false }) => (
    <GlassInput
      icon={Icon}
      label={label}
      type={type}
      disabled={!editMode || disabled}
      {...register(name)}
      className={`${!editMode ? 'bg-gray-50' : ''}`}
    />
  );

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Background */}
      <div className="absolute inset-0 gradient-doctor opacity-5"></div>
      
      <div className="relative z-10 p-6">
        <LoadingOverlay isLoading={isLoading} message={editMode ? "Updating profile..." : "Loading profile..."}>
          <GlassCard className="max-w-4xl mx-auto animate-fadeInUp">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Doctor Profile</h2>
              <p className="text-gray-600">Manage your professional information</p>
            </div>

            <form onSubmit={handleSubmit(handleSave)}>
              {/* Profile Picture Section */}
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full border-4 border-cyan-100 overflow-hidden bg-gray-100 flex items-center justify-center mx-auto">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Doctor avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  {editMode && (
                    <label className="absolute bottom-0 right-0 bg-cyan-500 p-3 rounded-full text-white hover:bg-cyan-600 transition-colors cursor-pointer shadow-lg">
                      <Camera size={18} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-semibold text-gray-800">{doctor?.name}</h3>
                  <p className="text-gray-600">{doctor?.specialization}</p>
                  <p className="text-sm text-gray-500">ID: {doctor?.loginId}</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <InputField icon={User} label="Full Name" name="name" />
                <InputField icon={Mail} label="Email Address" name="email" type="email" disabled />
                <InputField icon={Phone} label="Phone Number" name="phone" />
                <InputField icon={Stethoscope} label="Specialization" name="specialization" />
                <InputField icon={GraduationCap} label="Experience" name="experience" />
                <InputField icon={GraduationCap} label="Education" name="education" />
                <InputField icon={DollarSign} label="Consultation Fee (₹)" name="consultationFee" type="number" />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4">
                {editMode ? (
                  <>
                    <GlassButton
                      type="submit"
                      variant="success"
                      size="lg"
                      loading={isLoading}
                      className="bg-green-500 text-white hover:bg-green-600"
                    >
                      <Save size={18} />
                      Save Changes
                    </GlassButton>
                    <GlassButton
                      type="button"
                      onClick={() => setEditMode(false)}
                      variant="secondary"
                      size="lg"
                    >
                      Cancel
                    </GlassButton>
                  </>
                ) : (
                  <GlassButton
                    type="button"
                    onClick={() => setEditMode(true)}
                    variant="primary"
                    size="lg"
                    className="gradient-doctor text-white"
                  >
                    <Edit2 size={18} />
                    Edit Profile
                  </GlassButton>
                )}
              </div>
            </form>
          </GlassCard>
        </LoadingOverlay>
      </div>
    </div>
  );
};

export default DoctorProfile;