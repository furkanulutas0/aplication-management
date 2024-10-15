import { useEffect, useState } from "react";
import ApplicationBox from "../components/ApplicationBox";
import Modal from "../components/Modal";
import { supabase } from '../config/supabaseClient';


export default function Home() {
  interface Position {
    id: string;
    title: string;
    description: string;
    is_active: boolean;
    sub_description?: string;
  }

  interface Option {
    id: string;
    option_text: string;
  }

  interface Question {
    id: string;
    question_text: string;
    question_type: 'short_text' | 'long_text' | 'multiple_choice' | 'checkbox';
    options: Option[];
  }

  const [positions, setPositions] = useState<Position[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(null);
  const [selectedPositionTitle, setSelectedPositionTitle] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    schoolNumber: string;
    department: string;
    grade: string;
    answers: { [key: string]: string };
  }>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    schoolNumber: "",
    department: "",
    grade: "",
    answers: {}
  });

  const handleApplyClick = async (positionId: string, title: string) => {
    setSelectedPositionId(positionId);
    setSelectedPositionTitle(title);
    setIsModalOpen(true);
    setCurrentStep(1);

    const fetchedQuestions = await fetchQuestions(positionId);
    setQuestions(fetchedQuestions);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      schoolNumber: "",
      department: "",
      grade: "",
      answers: {}
    });
  };

  const handleNextStep = () => {
    if (currentStep === 2 && selectedPositionTitle === "Loop Core Başvuru Formu") {
      handleSubmitApplication(); // Başvuru tamamla fonksiyonunu burada çalıştırıyoruz
    } else if (currentStep === 1 && questions.length === 0) {
      setCurrentStep(3); // Eğer sorular yoksa doğrudan 3. adıma geç
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 3 && questions.length === 0) {
      setCurrentStep(1); 
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepOneValid = () => {
    const { firstName, lastName, email, phone, schoolNumber, department, grade } = formData;
    return firstName && lastName && email && phone && schoolNumber && department && grade;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      answers: {
        ...prevData.answers,
        [questionId]: value
      }
    }));
  };

 
  const fetchQuestions = async (positionId: string) => {
    const { data: questions, error } = await supabase
      .from('questions')
      .select('id, question_text, question_type, options (id, option_text)')
      .eq('position_id', positionId);

    if (error) {
      console.error('Error fetching questions:', error);
      return [];
    }

    return questions;
  };

  const handleSubmitApplication = async () => {
    try {
      const { firstName, lastName, email, phone, schoolNumber, department, grade, answers } = formData;


      const { data: applicationData, error: applicationError } = await supabase
        .from('applications')
        .insert({
          first_name: firstName,
          last_name: lastName,
          email,
          phone_number: phone,
          school_number: schoolNumber,
          department,
          grade,
          position_id: selectedPositionId
        })
        .select() 
        .single();

      if (applicationError) throw applicationError;

      const applicationId = applicationData?.id;

      if (!applicationId) {
        throw new Error("Başvuru ID'si oluşturulamadı.");
      }

    
      const answersData = Object.keys(answers).map(questionId => ({
        application_id: applicationId,
        question_id: questionId,
        answer: answers[questionId] ? answers[questionId] : "" 
      }));

      const { error: answersError } = await supabase
        .from('answers')
        .insert(answersData);

      if (answersError) {
        throw answersError;
      }


      alert('Başvurunuz başarıyla tamamlandı!');
      setIsModalOpen(false);
      if (selectedPositionTitle === "Loop Core Başvuru Formu") {
        window.open("https://www.instagram.com/douloop97/", "_blank");
      } else {
        window.open("https://www.instagram.com/muhendisbeyinlerdou/", "_blank");
      }

    } catch (error) {
      console.error('Başvuru işlemi sırasında hata oluştu:', error);
    }
  };


  useEffect(() => {
    const fetchPositions = async () => {
      const { data, error } = await supabase.from('positions').select('*');
      if (error) {
        console.error('Error fetching positions:', error);
      } else {
        setPositions(data);
      }
    };

    fetchPositions();
  }, []);

  return (
    <div className="min-h-full">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Açık Başvurular
          </h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-6xl py-6 sm:px-6 lg:px-8">
          <div className="bg-gray-50 px-2 py-3 sm:px-0 flex justify-center items-center">
            <div className="h-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {positions.map((position) => (
                <ApplicationBox
                  key={position.id}
                  title={position.title}
                  description={position.description}
                  subDescription={position.sub_description}
                  isActive={position.is_active}
                  deadline="01.01.2024"
                  onApplyClick={() => handleApplyClick(position.id, position.title)}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {currentStep !== 2 && <h2 className="text-xl font-bold mb-4">Başvuru Formu - Adım {questions.length === 0 && currentStep > 1 ? currentStep - 1 : currentStep}</h2>}
        {selectedPositionId && (
          <form
            className="flex flex-col space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmitApplication();
            }}
          >
            {currentStep === 1 && (
              <>
                <div className="w-full mb-4">
                  <label className="block text-gray-700 font-bold mb-2">Adınız</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="w-full mb-4">
                  <label className="block text-gray-700 font-bold mb-2">Soyadınız</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="w-full mb-4">
                  <label className="block text-gray-700 font-bold mb-2">E-posta Adresi</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="okulnumaranız@dogus.edu.tr"
                    required
                  />
                </div>
                <div className="w-full mb-4">
                  <label className="block text-gray-700 font-bold mb-2">Telefon Numaranız</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="w-full mb-4">
                  <label className="block text-gray-700 font-bold mb-2">Okul Numaranız</label>
                  <input
                    type="text"
                    name="schoolNumber"
                    value={formData.schoolNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="w-full mb-4">
                  <label className="block text-gray-700 font-bold mb-2">Bölümünüz</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="w-full mb-4">
                  <label className="block text-gray-700 font-bold mb-2">Sınıfınız</label>
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Seçin</option>
                    <option value="Hazırlık">Hazırlık</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>
                <div className="w-full flex justify-between">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-300 rounded-lg"
                  >
                    Kapat
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!isStepOneValid()}
                    className={`px-4 py-2 bg-blue-500 text-white rounded-lg ${!isStepOneValid() && "opacity-50 cursor-not-allowed"
                      }`}
                  >
                    İlerle
                  </button>
                </div>
              </>
            )}

            {currentStep === 2 && questions.length > 0 && (
              <>
                {questions.map((question) => (
                  <div key={question.id} className="w-full mb-4">
                    <label className="block text-gray-700 font-bold mb-2">
                      {question.question_text}
                    </label>

                    {question.question_type === "short_text" && (
                      <input
                        type="text"
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    )}
                    {question.question_type === "long_text" && (
                      <textarea
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    )}
                    {question.question_type === "multiple_choice" && (
                      <select
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="">Seçin</option>
                        {question.options.map((option) => (
                          <option key={option.id} value={option.option_text}>
                            {option.option_text}
                          </option>
                        ))}
                      </select>
                    )}
                    {question.question_type === "checkbox" && (
                      <div className="flex flex-col space-y-2">
                        {question.options.map((option) => (
                          <label key={option.id} className="inline-flex items-center">
                            <input
                              type="checkbox"
                              value={option.option_text}
                              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                              className="form-checkbox h-5 w-5 text-blue-600"
                            />
                            <span className="ml-2 text-gray-700">{option.option_text}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="w-full flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-4 py-2 bg-gray-300 rounded-lg"
                  >
                    Geri
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className={`px-4 py-2 ${selectedPositionTitle === "Loop Core Başvuru Formu" ? "bg-green-500" : "bg-blue-500"} text-white rounded-lg`}
                  >
                    {selectedPositionTitle === "Loop Core Başvuru Formu" ? "Başvuru Yap" : "İlerle"}
                  </button>
                </div>
              </>
            )}

            {currentStep === 3 && selectedPositionTitle !== "Loop Core Başvuru Formu" && (
              <div className="w-full text-center">
                <h3 className="text-lg font-bold mb-4">Başvurunuzu tamamlamak için şu linki takip edin:</h3>
                <a
                  href="http://doukampus.dogus.edu.tr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  SKS Kayıt
                </a>
                <div className="mt-6 flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-4 py-2 bg-gray-300 rounded-lg"
                  >
                    Geri
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-lg"
                  >
                    Başvuruyu Tamamla
                  </button>
                </div>
              </div>
            )}

            {/* KVKK Metni */}
            <div className="mt-4 text-center text-gray-600">
              Devam ederek{" "}
              <a href="/kvkk" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                KVKK Mevzuat ve Aydınlatma Metni
              </a>{" "}
              metnini onaylamış olursunuz.
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
