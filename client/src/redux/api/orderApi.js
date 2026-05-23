import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({ url: '/orders', method: 'POST', body: data }),
      invalidatesTags: ['Order'],
    }),
    getMyOrders: builder.query({
      query: () => '/orders/my',
      providesTags: ['Order'],
    }),
    getOrder: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    updateOrderToPaid: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/orders/${id}/pay`, method: 'PUT', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Order', id }],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/orders/${id}/status`, method: 'PUT', body: data }),
      invalidatesTags: ['Order'],
    }),
    getAllOrders: builder.query({
      query: (params) => ({ url: '/orders', params }),
      providesTags: ['Order'],
    }),
    createPaymentIntent: builder.mutation({
      query: (data) => ({ url: '/payment/create-payment-intent', method: 'POST', body: data }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetOrderQuery,
  useUpdateOrderToPaidMutation,
  useUpdateOrderStatusMutation,
  useGetAllOrdersQuery,
  useCreatePaymentIntentMutation,
} = orderApi;
