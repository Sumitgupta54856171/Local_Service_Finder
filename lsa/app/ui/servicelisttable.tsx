import  { useState } from 'react';
import { Pencil, Trash2, Plus, Star, MapPin, Building2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ServiceListTable() {
  // Mock data for the table
  const initialData = [
    {
      id: 1,
      serviceName: 'City General Hospital',
      category: 'Hospital',
      latitude: '40.7128',
      longitude: '-74.0060',
      rating: 4.5,
    },
    {
      id: 2,
      serviceName: 'Downtown ATM',
      category: 'ATM',
      latitude: '40.7135',
      longitude: '-74.0082',
      rating: 3.8,
    },
    {
      id: 3,
      serviceName: 'Green Cross Pharmacy',
      category: 'Pharmacy',
      latitude: '40.7150',
      longitude: '-74.0110',
      rating: 4.8,
    },
    {
      id: 4,
      serviceName: 'Central Police Station',
      category: 'Police Station',
      latitude: '40.7112',
      longitude: '-74.0055',
      rating: 4.0,
    },
    {
      id: 5,
      serviceName: 'Express Gas Station',
      category: 'Gas Station',
      latitude: '40.7180',
      longitude: '-74.0010',
      rating: 3.2,
    },
    // Adding more data to demonstrate pagination
    { id: 6, serviceName: 'Sunrise Clinic', category: 'Hospital', latitude: '40.7201', longitude: '-74.0123', rating: 4.1 },
    { id: 7, serviceName: 'City Center ATM', category: 'ATM', latitude: '40.7250', longitude: '-74.0090', rating: 4.0 },
    { id: 8, serviceName: 'Westside Pharmacy', category: 'Pharmacy', latitude: '40.7305', longitude: '-74.0150', rating: 4.6 },
    { id: 9, serviceName: 'North Precinct', category: 'Police Station', latitude: '40.7350', longitude: '-74.0020', rating: 3.9 },
    { id: 10, serviceName: 'Highway Gas & Go', category: 'Gas Station', latitude: '40.7400', longitude: '-73.9980', rating: 3.5 },
    { id: 11, serviceName: 'Community Hospital', category: 'Hospital', latitude: '40.7450', longitude: '-73.9950', rating: 4.3 },
    { id: 12, serviceName: 'Eastside ATM', category: 'ATM', latitude: '40.7500', longitude: '-73.9900', rating: 3.7 },
  ];

  const [services, setServices] = useState(initialData);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Handle Delete Action
  const handleDelete = (id) => {
    // Filter out the deleted service from state
    const updatedServices = services.filter((service) => service.id !== id);
    setServices(updatedServices);
    
    // Adjust pagination if deleting the last item on a page
    const newTotalPages = Math.ceil(updatedServices.length / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  // Handle Update Action (Mock)
  const handleUpdate = (id) => {
    alert(`Update button clicked for Service ID: ${id}\n(Normally this would route to the Update Page you created)`);
  };

  // Pagination Calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentServices = services.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(services.length / itemsPerPage);

  // Change page handlers
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Services List</h1>
            <p className="text-slate-500 text-sm mt-1">Manage and view all registered service locations.</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-sm shadow-blue-500/20">
            <Plus className="h-4 w-4" />
            Add New Service
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              
              {/* Table Head */}
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">Service Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Location (Lat, Lng)</th>
                  <th className="px-6 py-4 text-center">Rating</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              
              {/* Table Body */}
          <tbody className="divide-y divide-slate-100 text-sm">
            {currentServices.length > 0 ? (
              currentServices.map((service) => (
                <tr key={service.id} className="hover:bg-slate-50/50 transition-colors group">
                  
                  {/* Name Column */}
                      <td className="px-6 py-4 font-medium text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 rounded-md text-slate-500 group-hover:text-blue-600 transition-colors">
                            <Building2 className="h-4 w-4" />
                          </div>
                          {service.serviceName}
                        </div>
                      </td>
                      
                      {/* Category Column */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          {service.category}
                        </span>
                      </td>
                      
                      {/* Location Column */}
                      <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {service.latitude}, {service.longitude}
                        </div>
                      </td>
                      
                      {/* Rating Column */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className={`h-4 w-4 ${service.rating >= 4.0 ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} />
                          <span className="font-semibold text-slate-700">{service.rating.toFixed(1)}</span>
                        </div>
                      </td>
                      
                      {/* Actions Column */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Update Button */}
                          <button 
                            onClick={() => handleUpdate(service.id)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Update Service"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          
                          {/* Delete Button */}
                          <button 
                            onClick={() => handleDelete(service.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Service"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  /* Empty State */
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Building2 className="h-8 w-8 text-slate-300 mb-2" />
                        <p className="font-medium text-slate-600">No services found</p>
                        <p className="text-xs">Add a new service to get started.</p>
                      </div>
                    </td>
                  </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Controls */}
      {services.length > 0 && (
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-sm text-slate-500">
            Showing <span className="font-medium text-slate-900">{indexOfFirstItem + 1}</span> to <span className="font-medium text-slate-900">{Math.min(indexOfLastItem, services.length)}</span> of <span className="font-medium text-slate-900">{services.length}</span> results
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={prevPage}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-slate-300 text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                    currentPage === index + 1 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button 
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md border border-slate-300 text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  </div>
</div>
  );
}