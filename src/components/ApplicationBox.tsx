
interface ApplicationBoxProps {
  title: string;
  description: string;
  isActive: boolean;
  deadline: string;
  subDescription?: string;
  onApplyClick: () => void;
}

export default function ApplicationBox({ title, description, isActive, deadline, subDescription, onApplyClick }: ApplicationBoxProps) {
    return (
      <div className="bg-zinc-100 rounded-lg shadow-md p-6 max-w-xs m-4">
 
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-sm italic text-gray-500 mb-4">{description}</p>
  
  
        <hr className="border-t border-gray-300 mb-4" />
  

        <p className="text-sm text-gray-700 mb-6">{subDescription}</p>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-sm ${isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {isActive ? 'Açık' : 'Kapalı'}
            </span>
          </div>
          <p className="text-sm text-gray-500">Son Başvuru: <strong>{deadline}</strong></p>
        </div>
  
     
        <div className="flex space-x-4">
          <button className="bg-black text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-900" onClick={onApplyClick}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75h-10.5m0 0l4.5 4.5m-4.5-4.5l4.5-4.5" />
            </svg>
            <span>Başvur</span>
          </button>
          <button className="border border-gray-400 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m7.5-7.5l7.5 7.5-7.5 7.5" />
            </svg>
            <span>İncele</span>
          </button>
        </div>
      </div>
    );
  }