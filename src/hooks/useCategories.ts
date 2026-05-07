import type { Categoria } from '../types';
import { categoriaService } from '../services/categoriaService';
import { useAsyncData } from './useAsyncData';

export const useCategories = () => {
  return useAsyncData<Categoria[]>(
    () => categoriaService.listar(),
    [],
  );
};
