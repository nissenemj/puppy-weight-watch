
import Navigation from '@/components/Navigation'
import PuppyWeightTracker from '@/components/PuppyWeightTracker'

const Index = () => {
  return (
    <div className="min-h-screen bg-background pt-14">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <PuppyWeightTracker />
      </div>
    </div>
  )
}

export default Index
