import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { caesarCipher, playfairCipher, vigenereCipher, transpositionCipher } from '../utils/encryption';
import { EncryptionMethod } from '../types/encryption';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

export default function Encrypt() {
  const navigate = useNavigate();
  const [method, setMethod] = useState<EncryptionMethod>('caesar');
  const [text, setText] = useState('');
  const [key, setKey] = useState('');
  const [shift, setShift] = useState(3);
  const [result, setResult] = useState('');

  const handleEncrypt = () => {
    if (!text) {
      toast.error('الرجاء إدخال النص المراد تشفيره');
      return;
    }

    let encryptedText = '';
    try {
      switch (method) {
        case 'caesar':
          encryptedText = caesarCipher(text, shift);
          break;
        case 'playfair':
          if (!key) {
            toast.error('الرجاء إدخال كلمة المفتاح');
            return;
          }
          encryptedText = playfairCipher(text, key);
          break;
        case 'vigenere':
          if (!key) {
            toast.error('الرجاء إدخال كلمة المفتاح');
            return;
          }
          encryptedText = vigenereCipher(text, key);
          break;
        case 'transposition':
          if (!shift || shift < 2) {
            toast.error('الرجاء إدخال عدد الأعمدة (2 أو أكثر)');
            return;
          }
          encryptedText = transpositionCipher(text, shift);
          break;
      }
      setResult(encryptedText);
      toast.success('تم التشفير بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء التشفير');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-blue-100">
          <h1 className="text-3xl font-bold text-blue-600 mb-8 text-center">تشفير النص</h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع التشفير
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as EncryptionMethod)}
                className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                dir="rtl"
              >
                <option value="caesar">شفرة قيصر</option>
                <option value="playfair">شفرة بلايفير</option>
                <option value="vigenere">شفرة فيجنر</option>
                <option value="transposition">مصفوفة النقل</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                النص المراد تشفيره
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 h-32"
                dir="auto"
              />
            </div>

            {(method === 'caesar' || method === 'transposition') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {method === 'caesar' ? 'مقدار الإزاحة' : 'عدد الأعمدة'}
                </label>
                <input
                  type="number"
                  value={shift}
                  onChange={(e) => setShift(parseInt(e.target.value) || 0)}
                  className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  min={method === 'caesar' ? "1" : "2"}
                  max={method === 'caesar' ? "25" : undefined}
                />
              </div>
            )}

            {(method === 'playfair' || method === 'vigenere') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المفتاح
                </label>
                <input
                  type="text"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  dir="auto"
                />
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleEncrypt}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                تشفير
              </button>
              <button
                onClick={() => navigate('/encryption-method')}
                className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <ArrowLeft size={20} />
                رجوع
              </button>
            </div>

            {result && (
              <div className="mt-6">
                <h2 className="text-lg font-medium text-blue-600 mb-2">النتيجة:</h2>
                <div className="bg-gray-50 p-4 rounded-lg border-2 border-blue-100">
                  <p className="text-gray-800 break-all" dir="ltr">
                    {result}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}