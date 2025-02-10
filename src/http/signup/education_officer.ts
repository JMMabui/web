type dataSchema = {
  fullName: string
  profession: string
  dataOfBirth: Date
  email: string | null
  contact: string
  provincyAddress:
    | 'MAPUTO_CIDADE'
    | 'MAPUTO_PROVINCIA'
    | 'GAZA'
    | 'INHAMBANE'
    | 'MANICA'
    | 'SOFALA'
    | 'TETE'
    | 'ZAMBEZIA'
    | 'NAMPULA'
    | 'CABO_DELGADO'
    | 'NIASSA'
  address: string
  id: string
  createdAt: Date
  updatedAt: Date
}

export async function createEducationOfficer({
  address,
  contact,
  dataOfBirth,
  email,
  fullName,
  profession,
  provincyAddress,
}: dataSchema) {
  try {
    const response = await fetch('https://localhost:3333/education_officer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address,
        contact,
        dataOfBirth,
        email,
        fullName,
        profession,
        provincyAddress,
      }),
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const result = await response.json()
    console.log('Success:', result)
    return result
  } catch (error) {
    console.error('Error:', error)
  }
}
