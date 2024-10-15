import { useState, useEffect } from 'react';
import Modal from "../components/Modal"; 

interface ApplicationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplicationFormModal({ isOpen, onClose }: ApplicationFormModalProps) {
  const [step, setStep] = useState(1); // Adım kontrolü için state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    schoolNumber: '',
    department: '',
    grade: '',
  });
  const [isStepValid, setIsStepValid] = useState(false);
  const [isCompleteEnabled, setIsCompleteEnabled] = useState(false);

  // Adım ilerleme kontrolü
  useEffect(() => {
    if (step === 1) {
      setIsStepValid(
        !!formData.firstName &&
        !!formData.lastName &&
        formData.email.includes('@dogus.edu.tr') &&
        !!formData.phone &&
        !!formData.schoolNumber
      );
    } else if (step === 2) {
      setIsStepValid(!!formData.department && !!formData.grade);
    }
  }, [formData, step]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNextStep = () => {
    if (isStepValid && step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Dışarıda belirteceğiniz linke tıklandıktan sonra Başvuruyu Tamamla butonunu aktif et
  const handleExternalLinkClick = () => {
    setIsCompleteEnabled(true); // Son adımda başvuruyu tamamla butonunu aktif yapar
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
    onClose(); // Modalı kapat
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        {/* Adım 1 */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Adım 1: Temel Bilgiler</h2>
            <input
              type="text"
              name="firstName"
              placeholder="Adınız"
              className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg"
              value={formData.firstName}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Soyadınız"
              className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg"
              value={formData.lastName}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="E-posta Adresi"
              className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg"
              value={formData.email}
              onChange={handleInputChange}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Telefon Numaranız"
              className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg"
              value={formData.phone}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="schoolNumber"
              placeholder="Okul Numaranız"
              className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg"
              value={formData.schoolNumber}
              onChange={handleInputChange}
            />
          </div>
        )}

        {/* Adım 2 */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Adım 2: Eğitim Bilgileri</h2>
            <input
              type="text"
              name="department"
              placeholder="Bölümünüz"
              className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg"
              value={formData.department}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="grade"
              placeholder="Sınıfınız"
              className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg"
              value={formData.grade}
              onChange={handleInputChange}
            />
          </div>
        )}

        {/* Adım 3 */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Adım 3: Dış Link</h2>
            <p>
              <a
                href="https://ornek.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
                onClick={handleExternalLinkClick}
              >
                Bu linke tıklayın ve işlem tamamlandıktan sonra geri dönün
              </a>
            </p>
          </div>
        )}

        {/* İleri ve Geri Butonları */}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={handlePrevStep}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
            >
              Geri
            </button>
          )}
          {step < 3 && (
            <button
              type="button"
              onClick={handleNextStep}
              disabled={!isStepValid}
              className={`px-4 py-2 rounded ${
                isStepValid
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              İlerle
            </button>
          )}
          {step === 3 && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isCompleteEnabled}
              className={`px-4 py-2 rounded ${
                isCompleteEnabled
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Başvuruyu Tamamla
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
