import { filter } from "compression";

export const paginationAndFilter = (page, limit ) => {
  
    let pagination = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
    };

    return { pagination };
    
  };