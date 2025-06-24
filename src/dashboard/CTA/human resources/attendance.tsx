import { useState } from 'react'
import { Calendar, momentLocalizer, type Event } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useQuery } from '@tanstack/react-query'
import { getAllEmployees } from '@/http/employee/employee'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import Modal from '@/components/Modal'
import Button from '@/components/Button'

// Setup the localizer by providing the moment Object
const localizer = momentLocalizer(moment)

interface AttendanceEvent extends Event {
  employeeId: string
  status: 'PRESENTE' | 'ATRASADO' | 'AUSENTE'
  checkIn?: string
  checkOut?: string
}

// Mock data for attendance
const mockAttendance: AttendanceEvent[] = [
  {
    employeeId: 'clxrzapcr000010v0g5v3c15g',
    title: 'Jhon Doe - Presente',
    start: new Date(2024, 6, 22, 9, 0), // July 22, 2024
    end: new Date(2024, 6, 22, 17, 0),
    status: 'PRESENTE',
    checkIn: '08:55',
    checkOut: '17:05',
  },
  {
    employeeId: 'clxrzapvr000210v0j3qofsk1',
    title: 'Jane Smith - Atrasada',
    start: new Date(2024, 6, 22, 9, 30), // July 22, 2024
    end: new Date(2024, 6, 22, 17, 15),
    status: 'ATRASADO',
    checkIn: '09:15',
    checkOut: '17:15',
  },
  {
    employeeId: 'clxs1p40p000410v0i6hmflil',
    title: 'Peter Jones - Ausente',
    start: new Date(2024, 6, 23), // July 23, 2024
    end: new Date(2024, 6, 23),
    status: 'AUSENTE',
    allDay: true,
  },
   {
    employeeId: 'clxrzapcr000010v0g5v3c15g',
    title: 'Jhon Doe - Presente',
    start: new Date(2024, 6, 23, 9, 0), // July 23, 2024
    end: new Date(2024, 6, 23, 17, 0),
    status: 'PRESENTE',
    checkIn: '08:58',
    checkOut: '17:02',
  },
]

const eventStyleGetter = (event: Event) => {
  const customEvent = event as AttendanceEvent
  let backgroundColor = '#3174ad' // Default blue
  if (customEvent.status === 'PRESENTE') backgroundColor = '#4caf50' // Green
  if (customEvent.status === 'ATRASADO') backgroundColor = '#ff9800' // Orange
  if (customEvent.status === 'AUSENTE') backgroundColor = '#f44336' // Red

  const style = {
    backgroundColor,
    borderRadius: '5px',
    opacity: 0.8,
    color: 'white',
    border: '0px',
    display: 'block',
  }
  return {
    style,
  }
}

export function Attendance() {
  const [events, setEvents] = useState(mockAttendance)
  const [selectedEvent, setSelectedEvent] = useState<AttendanceEvent | null>(null)
  
  const { data: employeesData, isLoading: isLoadingEmployees } = useQuery({
    queryKey: ['employees'],
    queryFn: getAllEmployees,
  });

  const getEmployeeName = (employeeId: string) => {
    const employee = employeesData?.data?.find(emp => emp.id === employeeId);
    return employee ? `${employee.user.name} ${employee.user.surname}` : 'Desconhecido';
  };

  // Replace mock titles with real names
  const processedEvents = events.map(event => ({
      ...event,
      title: `${getEmployeeName(event.employeeId)} - ${event.status}`
  }));


  if (isLoadingEmployees) {
      return <LoadingSpinner />
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <header className="mb-6">
         <h1 className="text-3xl font-bold text-gray-800">
            Gestão de Assiduidade (Controle de Ponto)
        </h1>
        <p className="mt-2 text-gray-600">
            Visualize a assiduidade dos funcionários no calendário.
        </p>
      </header>
     
      <div style={{ height: '70vh' }}>
        <Calendar
          localizer={localizer}
          events={processedEvents}
          startAccessor="start"
          endAccessor="end"
          eventPropGetter={eventStyleGetter}
          onSelectEvent={event => setSelectedEvent(event as AttendanceEvent)}
          messages={{
              next: "Próximo",
              previous: "Anterior",
              today: "Hoje",
              month: "Mês",
              week: "Semana",
              day: "Dia"
          }}
        />
      </div>

       {selectedEvent && (
        <Modal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title={`Detalhes de ${getEmployeeName(selectedEvent.employeeId)}`}
        >
          <div className="space-y-4">
            <div><strong>Data:</strong> {moment(selectedEvent.start).format('DD/MM/YYYY')}</div>
            <div><strong>Status:</strong> {selectedEvent.status}</div>
            {selectedEvent.checkIn && <div><strong>Entrada:</strong> {selectedEvent.checkIn}</div>}
            {selectedEvent.checkOut && <div><strong>Saída:</strong> {selectedEvent.checkOut}</div>}
             <div className="flex justify-end gap-4 pt-4">
              <Button onClick={() => setSelectedEvent(null)} variant="secondary">Fechar</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
