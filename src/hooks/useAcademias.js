import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function useAcademias() {
  const { user } = useAuth()
  const [academias, setAcademias] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) carregarAcademias()
  }, [user])

  async function carregarAcademias() {
    setLoading(true)
    const { data, error } = await supabase
      .from('personal_academias')
      .select('academia_id, academias(id, nome, endereco, cidade, estado)')
      .eq('personal_id', user.id)

    if (!error) {
      setAcademias((data || []).map((pa) => pa.academias))
    }
    setLoading(false)
  }

  async function adicionarAcademia(dados) {
    // Cria a academia
    const { data: academia, error: errAcademia } = await supabase
      .from('academias')
      .insert(dados)
      .select()
      .single()

    if (errAcademia) throw errAcademia

    // Vincula ao personal
    const { error: errVinculo } = await supabase
      .from('personal_academias')
      .insert({ personal_id: user.id, academia_id: academia.id })

    if (errVinculo) throw errVinculo

    setAcademias((prev) => [...prev, academia])
    return academia
  }

  async function removerAcademia(academiaId) {
    const { error } = await supabase
      .from('personal_academias')
      .delete()
      .eq('personal_id', user.id)
      .eq('academia_id', academiaId)

    if (error) throw error
    setAcademias((prev) => prev.filter((a) => a.id !== academiaId))
  }

  return { academias, loading, carregarAcademias, adicionarAcademia, removerAcademia }
}
