import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Heart, Calendar, Award, Check, X, AlertCircle } from '@/utils/iconImports';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface TestMemoryAddProps {
  bookId: string;
  onMemoryAdded: () => void;
}

const TestMemoryAdd: React.FC<TestMemoryAddProps> = ({ bookId, onMemoryAdded }) => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<Array<{ type: string; success: boolean; error?: string }>>([]);
  const { toast } = useToast();

  const testMemoryTypes = [
    { type: 'text', label: 'Tekstimuisto', icon: Heart, contentType: 'text' },
    { type: 'event', label: 'Tapahtuma', icon: Calendar, contentType: 'event' },
    { type: 'milestone', label: 'Virstanpylväs', icon: Award, contentType: 'milestone' }
  ];

  const testMemoryAdd = async (memoryType: string, contentType: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Ei käyttäjää');

      const testMemoryData = {
        book_id: bookId,
        content_type: contentType,
        caption: `Testaa ${memoryType} muisto - ${new Date().toLocaleString('fi-FI')}`,
        tags: ['testi', memoryType],
        location: { name: 'Testi sijainti' },
        created_by: user.user.id,
      };

      console.log(`Testing ${memoryType} memory add:`, testMemoryData);

      const { data, error } = await supabase
        .from('memories')
        .insert(testMemoryData)
        .select();

      if (error) {
        console.error(`${memoryType} test error:`, error);
        return { type: memoryType, success: false, error: error.message };
      }

      console.log(`${memoryType} test success:`, data);
      return { type: memoryType, success: true };
    } catch (error: any) {
      console.error(`${memoryType} test exception:`, error);
      return { type: memoryType, success: false, error: error.message };
    }
  };

  const runTests = async () => {
    setTesting(true);
    setResults([]);
    
    try {
      const testResults = [];
      
      for (const test of testMemoryTypes) {
        const result = await testMemoryAdd(test.type, test.contentType);
        testResults.push(result);
        setResults([...testResults]);
        
        // Wait a bit between tests
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      const successCount = testResults.filter(r => r.success).length;
      
      toast({
        title: successCount === testResults.length ? "Testit onnistuivat!" : "Testit osittain epäonnistuivat",
        description: `${successCount}/${testResults.length} testiä onnistui`,
        variant: successCount === testResults.length ? "default" : "destructive",
      });
      
      if (successCount > 0) {
        onMemoryAdded();
      }
    } catch (error) {
      console.error('Test error:', error);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Camera className="w-5 h-5 text-orange-500" />
          Testaa muistojen lisäämistä
        </h3>
        <Button
          onClick={runTests}
          disabled={testing}
          className="bg-orange-500 hover:bg-orange-600"
        >
          {testing ? 'Testaa...' : 'Testaa kaikki tyypit'}
        </Button>
      </div>
      
      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((result, index) => (
            <motion.div
              key={result.type}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                result.success 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              {result.success ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <X className="w-5 h-5 text-red-600" />
              )}
              <div className="flex-1">
                <p className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                  {result.type} - {result.success ? 'Onnistui' : 'Epäonnistui'}
                </p>
                {result.error && (
                  <p className="text-sm text-red-600 mt-1">{result.error}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {testing && (
        <div className="flex items-center gap-2 mt-4 text-orange-600">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <AlertCircle className="w-4 h-4" />
          </motion.div>
          <span className="text-sm">Testaa muistojen lisäämistä...</span>
        </div>
      )}
    </div>
  );
};

export default TestMemoryAdd;