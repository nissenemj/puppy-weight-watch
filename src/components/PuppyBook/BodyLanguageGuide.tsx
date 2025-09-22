import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, BookOpen } from '@/utils/iconImports';

interface BodyLanguageGuideProps {
  trigger?: React.ReactNode;
}

export const BodyLanguageGuide: React.FC<BodyLanguageGuideProps> = ({ 
  trigger 
}) => {
  const bodyLanguageSigns = {
    relaxed: {
      title: 'Rento ja mukava pentu',
      color: 'bg-green-50 border-green-200 text-green-800',
      badgeColor: 'bg-green-500',
      emoji: '😊',
      signs: [
        'Häntä löyhässä, ei jäykkä',
        'Korvat rennosti, ei takana',
        'Suu hieman auki, kieli näkyy',
        'Pehmeä katse, ei tuijotusta',
        'Leikkisä kumarrus tai kävelee rennosti',
        'Kuuntelee ääniä uteliaana',
        'Lähestyy vapaaehtoisesti'
      ]
    },
    hesitant: {
      title: 'Epäröivä mutta rohkea',
      color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      badgeColor: 'bg-yellow-500',
      emoji: '😐',
      signs: [
        'Häntä hieman alhaalla, mutta liikkeessä',
        'Korvat eteenpäin suunnattu, valpas',
        'Huulten nuoleminen silloin tällöin',
        'Pysähtelee, mutta etenee',
        'Katselee sivuttain ennen lähestymistä',
        'Hengitys hieman tihentyy',
        'Voi hakea turvaa omistajasta'
      ]
    },
    fearful: {
      title: 'Pelokas tai stressaantunut',
      color: 'bg-red-50 border-red-200 text-red-800',
      badgeColor: 'bg-red-500',
      emoji: '😰',
      signs: [
        'Häntä tiukasti jalkojen välissä',
        'Korvat tiukasti taakse kiinni',
        'Suu kiinni, huulet tiukasti yhdessä',
        'Välttelevä katse tai tuijotus',
        'Jähmettynyt asento tai pakoyritykset',
        'Hengitys tiheää ja pinnallista',
        'Kuolaisu, vapina tai ulostaminen'
      ]
    }
  };

  const actionAdvice = {
    relaxed: {
      title: 'Mitä tehdä rentoa pentua?',
      advice: [
        '🎉 Hienoa! Jatka samalla tavalla',
        '🍖 Palkitse rohkeudesta herkulla',
        '📈 Voit lisätä vähitellen haastetta',
        '📝 Kirjaa positiivinen kokemus ylös'
      ]
    },
    hesitant: {
      title: 'Miten auttaa epäröivää pentua?',
      advice: [
        '⏰ Anna enemmän aikaa tutustua',
        '📏 Lisää etäisyyttä ärsykkeeseen',
        '🍖 Kannusta herkuilla pienistä askeleista',
        '🤫 Älä pakota, anna pennun päättää'
      ]
    },
    fearful: {
      title: 'Miten toimia pelokkaan pennun kanssa?',
      advice: [
        '🛑 Lopeta harjoitus välittömästi',
        '🏃 Siirry turvallisemmalle etäisyydelle',
        '💤 Anna lepotauko ennen uutta yritystä',
        '⬅️ Palaa aiempiin, helpoimpiin harjoituksiin'
      ]
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Kehonkielen opas
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Pennun kehonkielen opas
          </DialogTitle>
          <DialogDescription>
            Opi tunnistamaan pennun mielentila ja toimimaan sen mukaisesti
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Body Language Signs */}
          <div className="grid gap-4">
            {Object.entries(bodyLanguageSigns).map(([key, data]) => (
              <Card key={key} className={`border-2 ${data.color.split(' ').slice(1).join(' ')}`}>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{data.emoji}</span>
                    <div>
                      <h3 className="font-semibold text-[var(--color-text-primary)]">{data.title}</h3>
                      <Badge className={`${data.badgeColor} text-white text-xs`}>
                        {key === 'relaxed' ? 'Positiivinen' : 
                         key === 'hesitant' ? 'Neutraali' : 'Negatiivinen'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2 text-sm">Tunnusmerkit:</h4>
                      <ul className="text-sm space-y-1">
                        {data.signs.map((sign, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="mt-1 w-1 h-1 rounded-full bg-current flex-shrink-0" />
                            {sign}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2 text-sm">{actionAdvice[key as keyof typeof actionAdvice].title}</h4>
                      <ul className="text-sm space-y-1">
                        {actionAdvice[key as keyof typeof actionAdvice].advice.map((action, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="flex-shrink-0">{action.split(' ')[0]}</span>
                            <span>{action.split(' ').slice(1).join(' ')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* General Tips */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <h3 className="font-semibold text-blue-800 mb-3 text-[var(--color-text-primary)]">💡 Yleisiä vinkkejä</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
                <ul className="space-y-2">
                  <li>• Seuraa pennun kehonkieltä jatkuvasti harjoituksen aikana</li>
                  <li>• Lopeta aina positiiviseen hetkeen, älä odota negatiivista reaktiota</li>
                  <li>• Muista, että kehonkieli voi muuttua nopeasti</li>
                </ul>
                <ul className="space-y-2">
                  <li>• Älä tulkitse yhden merkin perusteella - katso kokonaisuutta</li>
                  <li>• Tuttu ympäristö auttaa pentua olemaan rennompi</li>
                  <li>• Epävarma? Valitse aina varovaisempi lähestymistapa</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};