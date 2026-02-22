'use client';

import  { useState,useEffect} from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Building2, ChevronDown, MapPin, Star } from 'lucide-react';
import { useParams } from 'next/navigation'
import axios from 'axios';
import Link from 'next/link';

export default function Updatepage() {
  const [isUpdated, setIsUpdated] = useState(false);
const id = useParams().id;

useEffect(()=>{

const fetchUpdateData = async () => {
  try {
    const response = await axios.get(`http://localhost:8000/api/public/${id}`);
    const data = response.data;
    formik.setValues({
      serviceName: data[0]?.name || '',
      category: data[0]?.category || '',
      longitude: data[0]?.location?.coordinates?.[0] || '',
      latitude: data[0]?.location?.coordinates?.[1] || '',
      rating: data[0]?.rating || '',
    });
  } catch (error) {
    console.error('Error fetching service data:', error);
  }
}
fetchUpdateData();

},[id])


  // Yup Validation Schema
  const validationSchema = Yup.object({
    serviceName: Yup.string()
      .required('Service Name is required')
      .min(3, 'Must be at least 3 characters'),
    category: Yup.string()
      .required('Category is required'),
    latitude: Yup.number()
      .typeError('Must be a valid number')
      .required('Latitude is required')
      .min(-90, 'Minimum latitude is -90')
      .max(90, 'Maximum latitude is 90'),
    longitude: Yup.number()
      .typeError('Must be a valid number')
      .required('Longitude is required')
      .min(-180, 'Minimum longitude is -180')
      .max(180, 'Maximum longitude is 180'),
    rating: Yup.number()
      .typeError('Must be a valid number')
      .min(0, 'Minimum rating is 0')
      .max(5, 'Maximum rating is 5')
      .required('Rating is required'),
  });



  const formik = useFormik({
    initialValues: {
      serviceName: 'City General Hospital',
      category: 'Hospital',
      latitude: '40.7128',
      longitude: '-74.0060',
      rating: '4.5',
    },
    validationSchema,
    onSubmit: async (values) => {
      const payload = {
        name: values.serviceName,
        category: values.category,
        location: {
          type: 'Point',
          coordinates: [parseFloat(values.longitude), parseFloat(values.latitude)],
        },
        rating: parseFloat(values.rating),
      };
      setIsUpdated(true);
      await axios.put(`http://localhost:8000/api/service/update/${id}`, payload);
      setTimeout(() => {
        setIsUpdated(false);
      }, 3000);
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex justify-center items-start pt-12 font-sans">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
        
        {/* Header */}
        <div className="px-8 pt-8 pb-4">
          <p className="text-slate-500 text-sm"><Link href="/admin/dashboard">← Back to Dashboard</Link></p>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Update Service</h1>
          <p className="text-slate-500 text-sm">Modify the details below to update the existing service location.</p>
        </div>

        {/* Success Message */}
        {isUpdated && (
          <div className="mx-8 mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium">
            Service successfully updated!
          </div>
        )}

        {/* Formik Form */}
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6 px-8 pb-8">
          
          {/* Basic Info Section */}
          <div className="space-y-4">
            <h3 className="text-slate-800 text-sm font-bold uppercase tracking-wider border-b border-slate-200 pb-2 mb-4">
              Basic Information
            </h3>
            
            <label className="block">
              <span className="text-slate-700 text-sm font-medium mb-1.5 block">Service Name</span>
              <div className="relative">
                <input
                  name="serviceName"
                  value={formik.values.serviceName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full bg-white border ${
                    formik.touched.serviceName && formik.errors.serviceName 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'
                  } rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-all shadow-sm`}
                  placeholder="e.g. City General Hospital"
                  type="text"
                />
                <Building2 className="absolute right-3 top-3.5 text-slate-400 h-5 w-5 pointer-events-none" />
              </div>
              {formik.touched.serviceName && formik.errors.serviceName && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">{formik.errors.serviceName}</p>
              )}
            </label>

            <label className="block">
              <span className="text-slate-700 text-sm font-medium mb-1.5 block">Category</span>
              <div className="relative">
                <select
                  name="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full bg-white border ${
                    formik.touched.category && formik.errors.category 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'
                  } rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-1 appearance-none cursor-pointer transition-all shadow-sm`}
                >
                  <option value="" label="Select a category" />
                  <option value="Hospital" label="Hospital" />
                  <option value="ATM" label="ATM" />
                  <option value="Pharmacy" label="Pharmacy" />
                  <option value="Police Station" label="Police Station" />
                  <option value="Gas Station" label="Gas Station" />
                </select>
                <ChevronDown className="absolute right-3 top-3.5 text-slate-400 h-5 w-5 pointer-events-none" />
              </div>
              {formik.touched.category && formik.errors.category && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">{formik.errors.category}</p>
              )}
            </label>
          </div>

          {/* Location Section */}
          <div className="space-y-4 pt-4">
            <div className="flex justify-between items-end border-b border-slate-200 pb-2 mb-4">
              <h3 className="text-slate-800 text-sm font-bold uppercase tracking-wider">Location Data</h3>
              <button 
                type="button" 
                className="text-blue-600 text-xs font-semibold flex items-center gap-1 cursor-pointer hover:bg-blue-100 bg-blue-50 px-2 py-1 rounded-md transition-colors"
              >
                <MapPin className="h-4 w-4" />
                Update to Current Location
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-slate-700 text-sm font-medium mb-1.5 block">Latitude</span>
                <input
                  name="latitude"
                  value={formik.values.latitude}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full bg-slate-50 border ${
                    formik.touched.latitude && formik.errors.latitude 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'
                  } rounded-lg px-4 py-3 text-slate-700 focus:outline-none focus:ring-1 transition-all font-mono text-sm shadow-sm`}
                  type="text"
                />
                {formik.touched.latitude && formik.errors.latitude && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium">{formik.errors.latitude}</p>
                )}
              </label>
              
              <label className="block">
                <span className="text-slate-700 text-sm font-medium mb-1.5 block">Longitude</span>
                <input
                  name="longitude"
                  value={formik.values.longitude}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full bg-slate-50 border ${
                    formik.touched.longitude && formik.errors.longitude 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'
                  } rounded-lg px-4 py-3 text-slate-700 focus:outline-none focus:ring-1 transition-all font-mono text-sm shadow-sm`}
                  type="text"
                />
                {formik.touched.longitude && formik.errors.longitude && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium">{formik.errors.longitude}</p>
                )}
              </label>
            </div>
          </div>

          {/* Metadata Section */}
          <div className="space-y-4 pt-4">
            <h3 className="text-slate-800 text-sm font-bold uppercase tracking-wider border-b border-slate-200 pb-2 mb-4">
              Metrics
            </h3>
            
            <label className="block">
              <span className="text-slate-700 text-sm font-medium mb-1.5 block">Current Rating</span>
              <div className={`flex items-center gap-2 bg-white border ${
                formik.touched.rating && formik.errors.rating ? 'border-red-500' : 'border-slate-300'
              } rounded-lg px-3 py-2.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all shadow-sm w-full sm:w-1/2`}>
                <Star className={`h-5 w-5 ${formik.values.rating ? 'text-yellow-400 fill-current' : 'text-slate-400'}`} />
                <input
                  name="rating"
                  value={formik.values.rating}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-transparent border-none p-0 w-full text-slate-900 focus:ring-0 text-sm outline-none"
                  max="5"
                  min="0"
                  placeholder="0.0"
                  step="0.1"
                  type="number"
                />
              </div>
              {formik.touched.rating && formik.errors.rating && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">{formik.errors.rating}</p>
              )}
            </label>
          </div>

          {/* Action Footer */}
          <div className="pt-6 mt-4 flex items-center justify-end gap-4 border-t border-slate-200">
            <button 
              type="button" 
              onClick={() => formik.resetForm()}
              className="text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium text-sm px-4 py-2 rounded-lg transition-colors"
            >
              Reset Changes
            </button>
            <button 
              type="submit" 
              className="flex items-center justify-center h-10 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}