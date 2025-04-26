import React, { useState } from 'react';
import Pagination from '../components/Pagination'; // adjust the path if needed

export default {
  title: 'Pagination/Pagination',
  component: Pagination,
};

export const Default = () => {
  const [page, setPage] = useState(1);

  return (
    <div className="p-6">
      <Pagination
        totalItems={150}
        itemsPerPage={10}
        currentPage={page}
        onPageChange={(newPage) => setPage(newPage)}
        maxPages={5}
        size="md"
        variant="default"
        showFirstLast
        showPrevNext
        showPageInfo
        pageInfoTemplate="Page {current} of {total}"
        showJumpInput
      />
    </div>
  );
};

export const OutlineVariant = () => {
  const [page, setPage] = useState(1);

  return (
    <div className="p-6">
      <Pagination
        totalItems={120}
        itemsPerPage={10}
        currentPage={page}
        onPageChange={(newPage) => setPage(newPage)}
        maxPages={7}
        size="sm"
        variant="outline"
        showFirstLast
        showPrevNext
        showPageInfo
      />
    </div>
  );
};

export const PillsVariant = () => {
  const [page, setPage] = useState(1);

  return (
    <div className="p-6">
      <Pagination
        totalItems={300}
        itemsPerPage={25}
        currentPage={page}
        onPageChange={(newPage) => setPage(newPage)}
        maxPages={10}
        size="lg"
        variant="pills"
        showFirstLast
        showPrevNext
        showPageInfo
        showItemsPerPageSelector
      />
    </div>
  );
};
