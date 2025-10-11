
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Check, X, Scale } from 'lucide-react'
import { format } from 'date-fns'
import { fi } from 'date-fns/locale'
import { useUpdateWeightEntry, useDeleteWeightEntry } from '@/hooks/useWeightEntries'
import type { WeightEntry } from '@/services/weightService'
import { EmptyState } from '@/components/EmptyState'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface WeightEntryListProps {
  entries: WeightEntry[]
  userId: string
}

interface EditingState {
  id: string
  weight: string
}

export default function WeightEntryList({ entries, userId }: WeightEntryListProps) {
  const [editingEntry, setEditingEntry] = useState<EditingState | null>(null)
  const [editError, setEditError] = useState<string>('')

  const updateMutation = useUpdateWeightEntry()
  const deleteMutation = useDeleteWeightEntry()

  const handleEdit = (entry: WeightEntry) => {
    setEditingEntry({ id: entry.id, weight: entry.weight.toString() })
    setEditError('')
  }

  const handleCancelEdit = () => {
    setEditingEntry(null)
    setEditError('')
  }

  const handleSaveEdit = async () => {
    if (!editingEntry) return

    const weightNum = parseFloat(editingEntry.weight)
    
    // Validate weight
    if (isNaN(weightNum)) {
      setEditError('Paino tulee olla numero')
      return
    }
    if (weightNum < 0.1) {
      setEditError('Painon tulee olla vähintään 0.1 kg')
      return
    }
    if (weightNum > 100) {
      setEditError('Painon tulee olla alle 100 kg')
      return
    }

    try {
      await updateMutation.mutateAsync({
        id: editingEntry.id,
        weight: weightNum,
        userId
      })
      setEditingEntry(null)
      setEditError('')
    } catch (error) {
      setEditError('Päivittäminen epäonnistui')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync({ id, userId })
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd.MM.yyyy', { locale: fi })
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <EmptyState
            icon={Scale}
            title="Ei painomittauksia vielä"
            description="Aloita seuraamalla pentusi painoa ensimmäisen kerran. Säännöllinen painonseuranta auttaa varmistamaan, että pentusi kasvaa terveellisesti."
            variant="default"
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5" />
          Painomittaukset ({entries.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {entries.slice(-10).reverse().map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                {editingEntry?.id === entry.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.1"
                      value={editingEntry.weight}
                      onChange={(e) =>
                        setEditingEntry({ ...editingEntry, weight: e.target.value })
                      }
                      className={`w-24 ${editError ? 'border-red-500' : ''}`}
                    />
                    <span>kg</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">
                      {entry.weight} kg
                    </Badge>
                  </div>
                )}
                <span className="text-sm text-gray-600">
                  {formatDate(entry.date)}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {editingEntry?.id === entry.id ? (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleSaveEdit}
                      disabled={updateMutation.isPending}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCancelEdit}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(entry)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Poista mittaus</AlertDialogTitle>
                          <AlertDialogDescription>
                            Haluatko varmasti poistaa mittauksen {entry.weight} kg ({formatDate(entry.date)})?
                            Tätä toimintoa ei voi peruuttaa.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Peruuta</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(entry.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Poista
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </div>
            </div>
          ))}
          
          {editError && (
            <p className="text-sm text-red-500 mt-2">{editError}</p>
          )}
          
          {entries.length > 10 && (
            <p className="text-sm text-gray-500 text-center pt-2">
              Näytetään 10 viimeisintä mittausta
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
