
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Link } from 'react-router-dom'
import { ArrowLeft, Database, Search, Filter } from 'lucide-react'

const feedingData = [
  {
    id: 'BC_PUPPY_DRY_LAMB',
    name: 'Brit Care Dog Hypoallergenic Puppy Lamb & Rice',
    manufacturer: 'Brit',
    type: 'Kuiva',
    nutritionType: 'Täysravinto',
    dosageBase: 'Odotettu_Aikuispaino_Ja_Ikä',
    notes: 'Sopii myös tiineille ja imettäville nartuille',
    entries: [
      { adultWeight: 5, ageMonths: '1-3', dailyAmount: 50 },
      { adultWeight: 5, ageMonths: '3-4', dailyAmount: 75 },
      { adultWeight: 5, ageMonths: '4-6', dailyAmount: 75 },
      { adultWeight: 5, ageMonths: '6-12', dailyAmount: 70 },
      { adultWeight: 10, ageMonths: '1-3', dailyAmount: 85 },
      { adultWeight: 10, ageMonths: '3-4', dailyAmount: 120 },
      { adultWeight: 10, ageMonths: '4-6', dailyAmount: 130 },
      { adultWeight: 10, ageMonths: '6-12', dailyAmount: 120 },
    ]
  },
  {
    id: 'HHC_PUPPY_DRY',
    name: 'Hau-Hau Champion Pentu & Emo',
    manufacturer: 'Hau-Hau Champion',
    type: 'Kuiva',
    nutritionType: 'Täysravinto',
    dosageBase: 'Odotettu_Aikuispaino_Ja_Ikä',
    notes: 'Sopii myös emolle',
    entries: [
      { adultWeight: 5, ageMonths: '1-2', dailyAmount: 70 },
      { adultWeight: 5, ageMonths: '3-4', dailyAmount: 90 },
      { adultWeight: 5, ageMonths: '5-6', dailyAmount: 90 },
      { adultWeight: 5, ageMonths: '7-12', dailyAmount: 80 },
      { adultWeight: 10, ageMonths: '1-2', dailyAmount: 100 },
      { adultWeight: 10, ageMonths: '3-4', dailyAmount: 140 },
      { adultWeight: 10, ageMonths: '5-6', dailyAmount: 140 },
    ]
  },
  {
    id: 'MUSH_PUPPY_RAW',
    name: 'MUSH Vaisto Puppy',
    manufacturer: 'MUSH',
    type: 'Raaka',
    nutritionType: 'Täysravinto',
    dosageBase: 'Odotettu_Aikuispaino_Ja_Ikä',
    notes: 'Kaava: Aikuispaino × kerroin',
    entries: [
      { adultWeight: 'Kaikki', ageMonths: '1-2', dailyAmount: 'Aikuispaino × 100g' },
      { adultWeight: 'Kaikki', ageMonths: '2-4', dailyAmount: 'Aikuispaino × 75g' },
      { adultWeight: 'Kaikki', ageMonths: '4-6', dailyAmount: 'Aikuispaino × 50g' },
      { adultWeight: 'Kaikki', ageMonths: '6-9', dailyAmount: 'Aikuispaino × 30g' },
      { adultWeight: 'Kaikki', ageMonths: '9+', dailyAmount: 'Aikuispaino × 25g' },
    ]
  },
  {
    id: 'SMAAK_PUPPY_RAW',
    name: 'SMAAK Raaka täysravinto',
    manufacturer: 'SMAAK',
    type: 'Raaka',
    nutritionType: 'Täysravinto',
    dosageBase: 'Nykyinen_Paino',
    notes: 'Annos on laaja vaihteluväli',
    entries: [
      { currentWeight: 5, dailyAmount: '75-150g' },
      { currentWeight: 10, dailyAmount: '150-300g' },
      { currentWeight: 15, dailyAmount: '225-450g' },
      { currentWeight: 20, dailyAmount: '300-600g' },
      { currentWeight: 25, dailyAmount: '375-750g' },
    ]
  },
  {
    id: 'BP_WET_BEEF',
    name: 'Brit Premium by Nature Beef with Tripe',
    manufacturer: 'Brit',
    type: 'Märkä',
    nutritionType: 'Täysravinto/Täydennysravinto',
    dosageBase: 'Kokoluokka',
    notes: 'Eri annokset täys- ja täydennysravintona',
    entries: [
      { sizeCategory: 'Pieni (1-10 kg)', fullNutrition: '200-400g', supplementary: '100-200g' },
      { sizeCategory: 'Keski (10-25 kg)', fullNutrition: '400-800g', supplementary: '200-400g' },
      { sizeCategory: 'Suuri (25-50 kg)', fullNutrition: '800-1200g', supplementary: '400-600g' },
    ]
  }
]

export default function FeedingData() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterManufacturer, setFilterManufacturer] = useState('all')

  const filteredData = feedingData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || item.type.toLowerCase() === filterType.toLowerCase()
    const matchesManufacturer = filterManufacturer === 'all' || item.manufacturer.toLowerCase() === filterManufacturer.toLowerCase()
    return matchesSearch && matchesType && matchesManufacturer
  })

  const manufacturers = [...new Set(feedingData.map(item => item.manufacturer))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/info">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Takaisin
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Yksityiskohtaiset annostelutiedot
          </h1>
        </div>

        {/* Introduction */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-6 w-6" />
              Annosteluohjeiden monimuotoisuus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed mb-4">
              Yksi suurimmista haasteista luotaessa yleiskäyttöistä koiranpennun ruokintalaskuria on valmistajien 
              annosteluohjeiden täydellinen epäyhtenäisyys. Annosteluohjeet voidaan ryhmitellä neljään päämetodiin:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 text-sm">Metodi 1</h3>
                <p className="text-xs text-blue-700">Odotettu aikuispaino ja ikä</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 text-sm">Metodi 2</h3>
                <p className="text-xs text-green-700">Nykyinen paino</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <h3 className="font-semibold text-orange-800 text-sm">Metodi 3</h3>
                <p className="text-xs text-orange-700">Prosentti nykyisestä painosta</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-purple-800 text-sm">Metodi 4</h3>
                <p className="text-xs text-purple-700">Koiran kokoluokka</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Suodata tietoja
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Hae tuotteita</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Etsi tuotteen nimellä..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Ruokatyyppi</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Valitse tyyppi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Kaikki</SelectItem>
                    <SelectItem value="kuiva">Kuivaruoka</SelectItem>
                    <SelectItem value="märkä">Märkäruoka</SelectItem>
                    <SelectItem value="raaka">Raakaruoka</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Valmistaja</label>
                <Select value={filterManufacturer} onValueChange={setFilterManufacturer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Valitse valmistaja" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Kaikki</SelectItem>
                    {manufacturers.map(manufacturer => (
                      <SelectItem key={manufacturer} value={manufacturer.toLowerCase()}>
                        {manufacturer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Display */}
        <div className="space-y-8">
          {filteredData.map((product) => (
            <Card key={product.id} className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">{product.name}</CardTitle>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {product.manufacturer}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {product.type}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {product.nutritionType}
                      </span>
                    </div>
                  </div>
                </div>
                {product.notes && (
                  <p className="text-sm text-gray-600 mt-2">{product.notes}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {product.dosageBase === 'Odotettu_Aikuispaino_Ja_Ikä' && (
                          <>
                            <TableHead>Odotettu aikuispaino (kg)</TableHead>
                            <TableHead>Pennun ikä (kk)</TableHead>
                            <TableHead>Päivittäinen annos (g)</TableHead>
                          </>
                        )}
                        {product.dosageBase === 'Nykyinen_Paino' && (
                          <>
                            <TableHead>Nykyinen paino (kg)</TableHead>
                            <TableHead>Päivittäinen annos (g)</TableHead>
                          </>
                        )}
                        {product.dosageBase === 'Kokoluokka' && (
                          <>
                            <TableHead>Kokoluokka</TableHead>
                            <TableHead>Täysravintona (g)</TableHead>
                            <TableHead>Täydennysravintona (g)</TableHead>
                          </>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {product.entries.map((entry, index) => (
                        <TableRow key={index}>
                          {product.dosageBase === 'Odotettu_Aikuispaino_Ja_Ikä' && (
                            <>
                              <TableCell>{entry.adultWeight}</TableCell>
                              <TableCell>{entry.ageMonths}</TableCell>
                              <TableCell>{entry.dailyAmount}</TableCell>
                            </>
                          )}
                          {product.dosageBase === 'Nykyinen_Paino' && (
                            <>
                              <TableCell>{entry.currentWeight}</TableCell>
                              <TableCell>{entry.dailyAmount}</TableCell>
                            </>
                          )}
                          {product.dosageBase === 'Kokoluokka' && (
                            <>
                              <TableCell>{entry.sizeCategory}</TableCell>
                              <TableCell>{entry.fullNutrition}</TableCell>
                              <TableCell>{entry.supplementary}</TableCell>
                            </>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredData.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Ei tuloksia hakuehdoillasi. Kokeile muuttaa hakuehtoja.</p>
            </CardContent>
          </Card>
        )}

        {/* Missing Data Notice */}
        <Card className="mt-8 bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800">Huomautus puuttuvista tiedoista</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700 text-sm">
              Useiden suosittujen merkkien (Royal Canin, Acana, Purenatural) osalta tarkkoja ja 
              käyttökelpoisia annostelutaulukoita ei ollut saatavilla tutkituista lähteistä. 
              Nämä aukot on dokumentoitu selkeästi.
            </p>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Link to="/info/market-analysis">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Edellinen: Markkina-analyysi
            </Button>
          </Link>
          <Link to="/info/safety">
            <Button>
              Seuraava: Turvallisuus
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
