"use client"
import Layout from '@/components/Layout'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { CheckCheckIcon, CheckCircle, Loader2, Locate, Pointer } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

type  Props = {
  params: {
    applicantId: string,
    applicationId: string
  }
}

const Approval = ({ params }: Props) => {
  const router = useRouter()
  const [longitude,setLongitude] = React.useState(0)
  const [latitude,setLatitude] = React.useState(0)
  const [error,setError] = React.useState('')
  const [loading,setLoading] = React.useState(false)
  const [success,setSuccess] = React.useState(false)
  const [rejecting,setRejecting] = React.useState(false)
  const [isLocationAllowed,setIsLocationAllowed] = React.useState(false)
  const [successMessage,setSuccessMessage] = React.useState('')
  const { applicantId, applicationId } = params
  const applicantIdDecoded = decodeURIComponent(applicantId)
  const applicationIdDecoded = decodeURIComponent(applicationId)
  console.log(applicantIdDecoded, applicationIdDecoded)
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setIsLocationAllowed(true)
        setLongitude(position.coords.longitude)
        setLatitude(position.coords.latitude)
      })
    }

  }, [
    setLongitude,
    setLatitude
  ])

  React.useEffect(() => {
    if(!isLocationAllowed) {
      setError('Location not allowed')
    }
    if(isLocationAllowed) {
      setError('')
      shareLocation()
    }
  }
  , [isLocationAllowed,
    router
  ])
  const shareLocation = () => {
    setLoading(true)
    try {
      
      if(!isLocationAllowed) {
        setLoading(false)
        setError('Location not allowed')
        return
      }
       // api call to share location /api/admin/approved/share-location
    const data = {
      applicantId: applicantIdDecoded,
      applicationId: applicationIdDecoded,
      /* convert to String */
      longitude: String(longitude),
      latitude:  String(latitude)
    }
    fetch('/api/products/admin/tenders/approve/share-location', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(res => res.json())
    .then(data => {
      if(data.status === 200){
        setLoading(false)
        setSuccess(true)
        setSuccessMessage(data.message)
      }
     if(data.status === 400){
       setLoading(false)
       setError(data.message)
     }
    }).catch(err => {
      setLoading(false)
      setError(err.message)
    }
    )
    } catch (error:any) {
      setLoading(false)
      setError(error.message)

    }
   
  }

  const rejectApplication = () => {
   setRejecting(true)
   setIsLocationAllowed(false)
   setError('You have rejected the application')
    setSuccess(false)

    setTimeout(() => {
      setRejecting(false)
      setError('')
    }
    , 2000)

  }
  return (
    <Layout>
    <div className='flex flex-col  justify-center gap-y-4 items-center'>
      <h2 className="text-2xl my-2 font-bold">
        Application Approval
      </h2>
      <Card className='flex justify-center items-center gap-y-5 p-2  bg-white shadow-lg flex-col'>
        {
          error && (
            <Badge className='text-red-500'>
              {error}
            </Badge>
          )
        }
        {
          success && (
            <Badge className='text-green-500'>
             {
                successMessage
             }
            </Badge>
          )
        }
        {
          loading && (
            <Badge className='text-blue-500 flex-row gap-x-1 flex justify-center items-center'>
              <span className=' text-sm'
              >Loading...</span>
              <Loader2 size={24}
              className='animate-spin'
              />
            </Badge>
          )

        }

        <Card className='flex flex-row p-2 m-1 justify-between items-center gap-x-7'>
          {
            success && (
           <>
              <CheckCircle
              className='text-green-500'
               size={64} />

               <p className='text-sm p-2 max-w-md'>
                You can now close the page but not your location,
                We will keep tracking your location
              </p>
           </>
            )

          }
          </Card>
      </Card>
      {
        isLocationAllowed && (
          <>
          <div className='flex flex-col my-3 justify-center items-center mx-auto'>
          <Badge className='text-sm'>
            Location is allowed: {isLocationAllowed ? 'Yes' : 'No'}
          </Badge>
          <div className='flex flex-col items-center mx-auto justify-center gap-4'>
            <h5  className='text-sm p-2 max-w-md'>
            Your Tender was approved by the admin, Allow Your location to share with the admin            
            </h5>
            <p className='text-sm p-2 max-w-md'>
              Your location will be shared with the admin,
              Keep the location enabled to track the tender location
            </p>
            <Locate
            className='text-green-500
            '
             size={64} />
          </div>

          <div className='flex flex-row my-5 justify-center gap-4'>
            <button
            disabled={loading}
             className='bg-green-500 m-1 rounded-lg  px-4 py-2 hover:bg-green-700 text-white' onClick={() => {
             shareLocation()
            }}>
              {
                loading ? (
                  <Loader2 size={24}
                  className='animate-spin'
                   />
                
                ) : 'Share Location'
              }
            </button>
            <button
            disabled={rejecting || success || loading}
            className='bg-red-500 m-1 rounded-lg  px-4 py-2 hover:bg-red-700 text-white' onClick={() => {
              rejectApplication()
            }}>
              {
                rejecting ? (
                  <Loader2 size={24}
                  className='animate-spin'
                   />
                
                ) : 'Reject Application'
              }
            </button>
          </div>
        </div>
          </>
        )
      }
       <Card  className='flex  max-w-md mx-auto justify-center items-center p-2 bg-white shadow-lg flex-col'>
        <Card className='flex flex-row p-2 m-1  max-w-sm mx-auto  justify-between items-center gap-x-7'>
          <div className='flex flex-col'>
            <label className='text-sm'>Applicant ID</label>
            <input type='text' value={applicantIdDecoded.slice(0, 12).concat('...')}
             disabled />
          </div>
          <div className='flex flex-col'>
            <label className='text-sm'>Application ID</label>
            <input type='text' value={applicationIdDecoded.slice(0, 12).concat('...')}
             disabled />
          </div>
        </Card>
        <Card className='flex  max-w-sm mx-auto  flex-row p-2 m-1 justify-between items-center gap-x-7'>
          <label className='text-sm'>Location</label>
          <div className='flex flex-row'>
            <input type='text' value={longitude} disabled />
            <input type='text' value={latitude} disabled />
          </div>
        </Card>
      
        
       </Card>

       {
  !isLocationAllowed && (
    <Card className="text-center my-4 p-4">
      <h2>Location not allowed</h2>
      <p>
        Please enable location to see more details
      </p>

      <Pointer size={64} className="m-auto" />


    </Card>
  )
}

    </div>
    </Layout>
  )
}

export default Approval