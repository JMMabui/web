export function LoadingSkeleton() {
  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-gradient-to-br from-gray-50 to-white">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center w-full p-4 bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="w-64 h-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg animate-pulse" />
          <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg animate-pulse" />
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full animate-pulse" />
          <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex flex-col p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-sm shadow-sm rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full animate-pulse" />
                <div className="space-y-2">
                  <div className="w-32 h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full animate-pulse" />
                  <div className="w-16 h-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Section Skeleton */}
        <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-xl p-6 border border-gray-100">
          <div className="w-48 h-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full animate-pulse mb-6" />
          <div className="w-full h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full animate-pulse" />
          <div className="w-16 h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full animate-pulse mt-3" />
        </div>

        {/* Recent Activities Skeleton */}
        <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-xl p-6 border border-gray-100">
          <div className="w-48 h-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full animate-pulse mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors duration-300"
              >
                <div className="space-y-2">
                  <div className="w-48 h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full animate-pulse" />
                  <div className="w-32 h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full animate-pulse" />
                </div>
                <div className="w-20 h-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
