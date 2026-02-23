'use client'

import  { useState,useEffect} from 'react';
import { Pencil, Trash2, Plus, Star, MapPin, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

import axios from 'axios';


export default function ServiceDetailTable() {
  


  const [services, setServices] = useState([]);


 
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
 useEffect(() => { 
    const fetchData = async()=> {
        try{
         const skip = (currentPage - 1) * itemsPerPage;
         const response = await axios.get(`http://localhost:8000/api/public/${itemsPerPage}/${skip}`, { withCredentials: true });
         console.log("API response:", response.data);
         // Map backend data to table structure (fix: use response.data directly)
         const mapped = (response.data || []).map(item => ({
           id: item.id,
           serviceName: item.name,
           category: item.category,
           latitude: item.location?.coordinates?.[1] ?? '',
           longitude: item.location?.coordinates?.[0] ?? '',
           rating: item.rating ?? 0,
         }));
         setServices(mapped); 
         console.log("Mapped services:", mapped);
        }catch(error) {
          console.error("Error fetching service data:", error);
        }
    }
     fetchData();
},[currentPage, itemsPerPage])  
  // Handle Delete Action
  const handleDelete = async (id) => {
    try {
      // Typically, you'd call a DELETE API here.
        console.log("API response:", id);
      await axios.delete(`http://localhost:8000/api/service/delete/${id}`, { withCredentials: true });

      // Filter out the deleted service from state
      const updatedServices = services.filter((service) => service.id !== id);
      setServices(updatedServices);
      
      // If we deleted the last item on current page and it's not the first page, go back
      if (updatedServices.length === 0 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  // Handle Update Action (Mock)
  const handleUpdate = (id) => {
    console.log(`Navigating to update page for service ID: ${id}`);
    window.location.href = `/admin/admin/update/service/${id}`;
    alert(`Update button clicked for Service ID: ${id}\n(Normally this would route to the Update Page you created)`);
  };

  // Use services as-is since API already paginates
  const currentServices = services;

  // Change page handlers
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const nextPage = () => setCurrentPage((prev) => prev + 1);

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
            <Link href="/admin/add/service">Add New Service</Link>
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-sm shadow-blue-500/20">
            <Plus className="h-4 w-4" />
            <Link href="/admin/dashboard/bulkupload/service">Bulk Upload</Link>
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
                          <Star className={`h-4 w-4 ${Number(service.rating) >= 4.0 ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} />
                          <span className="font-semibold text-slate-700">{Number(service.rating || 0).toFixed(1)}</span>
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
            Showing <span className="font-medium text-slate-900">{services.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="font-medium text-slate-900">{(currentPage - 1) * itemsPerPage + services.length}</span> results
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={prevPage}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-slate-300 text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 text-sm">Page {currentPage}</span>
            <button 
              onClick={nextPage}
              disabled={services.length < itemsPerPage}
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