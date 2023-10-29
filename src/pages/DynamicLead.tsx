import { Button, Container } from '@mui/material';
import { Box, Stack } from '@mui/system';
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AddLead, { leadsInitialState } from '../components/add-lead/AddLead';
import LeadsTable from '../components/leads-table/LeadsTable';
import CustomModal from '../components/modals/CustomModal';
import CsvUpload from '../components/upload-file/CsvUpload';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { getCategories } from '../redux/middleware/category';
import { createBulkLead, createLead, getLeads } from '../redux/middleware/lead';
import { categorySelector } from '../redux/slice/categorySlice';
import { leadState, openModal } from '../redux/slice/leadSlice';
import { CategoryResponseTypes } from '../types';
import createAbortController from '../utils/createAbortController';

type AddNewColumnsTypes = {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date';
};

const DynamicLead = () => {
  const categories: CategoryResponseTypes[] = useAppSelector(categorySelector);
  const { data, isModalOpen } = useAppSelector(leadState);
  const dispatch = useAppDispatch();
  const { signal, abort } = createAbortController();

  const [selected, setSelected] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [uploadedLeads, setUploadedLeads] = useState([]);
  const [uploadedLeadsCols, setUploadedLeadsCols] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [addNewLead, setAddNewLead] = useState([leadsInitialState]);
  const [addNewColumns, setAddNewColumns] = useState<AddNewColumnsTypes[]>([
    {
      name: 'name',
      type: 'string'
    }
  ]);
  const [addNewLeadData, setAddNewLeadData] = useState({});

  useEffect(() => {
    ((async) => {
      dispatch(getCategories({ signal }));
    })();
    return () => {
      abort();
    };
  }, []);

  useEffect(() => {
    if (!categories.length) return;
    ((async) => {
      dispatch(getLeads({ categoryId: categories[0].id, signal }));
    })();
    return () => {
      abort();
    };
  }, []);

  const handleCsvData = (csvData) => {
    setUploadedLeads(csvData);
    // get columns from csv data
    setUploadedLeadsCols(getColumns(csvData));
  };

  const submitBulkLeads = () => {
    const leadsFormattedData = {
      tableName: 'dynamicleadtests',
      columns: getColumns(uploadedLeads),
      data: uploadedLeads
    };
    dispatch(createBulkLead({ leads: leadsFormattedData, signal }));
  };

  const getColumns = useCallback((data: any) => {
    const columns = [];
    const keys = Object.keys(data[0]);
    keys.forEach((key) => {
      columns.push({
        name: key,
        type: 'string'
      });
    });
    return columns;
  }, []);

  const handleRequestSort = (event, property) => {
    // const isAsc = orderBy === property && order === 'asc';
    // setOrder(isAsc ? 'desc' : 'asc');
    // setOrderBy(property);
  };

  const addNewField = () => {
    const updatedLead = [...addNewLead];
    updatedLead.push({
      fieldName: '',
      type: '',
      value: ''
    });
    const updatedColumns = [...addNewColumns];
    updatedColumns.push({
      name: '',
      type: 'string'
    });
    setAddNewLead(updatedLead);
    setAddNewColumns(updatedColumns);
  };

  const getAddLeadData = (value, name, index) => {
    // find the index of the field
    const updatedLead = [...addNewLead];
    updatedLead[index][name] = value;
    setAddNewLead(updatedLead);
    const updatedColumns = [...addNewColumns];
    updatedColumns[index]['name'] = value;
    setAddNewColumns(updatedColumns);
    if (name === 'value') {
      const updatedData = { ...addNewLeadData };
      const data = {
        ...updatedData,
        [updatedLead[index]['fieldName']]: value
      };
      setAddNewLeadData(data);
    }
  };

  const submitAddNewLead = () => {
    const data = {
      tableId: selectedCategory,
      columns: addNewColumns,
      data: addNewLeadData
    };
    dispatch(createLead({ lead: data, signal }));
    // reset the state
    setAddNewLead([leadsInitialState]);
    setAddNewColumns([
      {
        name: 'name',
        type: 'string'
      }
    ]);
    setAddNewLeadData({});
    setIsAddLeadModalOpen(false);
  };

  return (
    <Fragment>
      <Helmet>
        <title> Dynamic Leads | Minimal UI </title>
      </Helmet>
      <Container>
        <h1>Dynamic Lead</h1>
        <Stack direction="row" alignItems="center" gap={2} mb={5} overflow="scroll" width={'100%'}>
          {(categories &&
            categories.map((category: CategoryResponseTypes) => (
              <Button
                key={category.name}
                variant="outlined"
                sx={{ minWidth: 'auto' }}
                onClick={() => {
                  dispatch(getLeads({ categoryId: category.id, signal }));
                }}
              >
                {category.name}
              </Button>
            ))) ||
            ''}
        </Stack>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={() => dispatch(openModal(true))} variant="contained">
            Upload CSV
          </Button>
          <Button onClick={() => setIsAddLeadModalOpen(true)} variant="contained">
            Add Lead
          </Button>
        </Box>
        <Box>
          <CustomModal
            title="Upload Lead CSV"
            open={isModalOpen}
            setOpen={() => dispatch(openModal(false))}
            handleSubmit={submitBulkLeads}
            size="lg"
          >
            <CsvUpload handleCsvData={handleCsvData} />
            {(uploadedLeads.length && (
              <LeadsTable
                data={uploadedLeads}
                headLabel={getColumns(uploadedLeads)}
                order="asc"
                orderBy={getColumns(uploadedLeads).length && getColumns(uploadedLeads)[0].name}
                rowCount={10}
                selected={selected}
                emptyRows={0}
                isNotFound={false}
                filterName={filterName}
                onRequestSort={() => {}}
                onSelectAllClick={() => {}}
                handleClick={() => {}}
              />
            )) ||
              ''}
          </CustomModal>
        </Box>
        <Box>
          <CustomModal
            title="Add Lead"
            size="md"
            open={isAddLeadModalOpen}
            setOpen={() => setIsAddLeadModalOpen(false)}
            handleSubmit={submitAddNewLead}
          >
            <AddLead
              leadValue={addNewLead}
              getAddLeadData={getAddLeadData}
              addNewLead={addNewField}
              selectedCategory={selectedCategory}
              setSelectedCategory={(value) => setSelectedCategory(value)}
            />
          </CustomModal>
        </Box>

        {(data && data.length && (
          <Box>
            <LeadsTable
              data={data}
              headLabel={getColumns(data)}
              order="asc"
              orderBy={getColumns(data).length && getColumns(data)[0].name}
              rowCount={10}
              selected={selected}
              emptyRows={0}
              isNotFound={false}
              filterName={filterName}
              onRequestSort={() => {}}
              onSelectAllClick={() => {}}
              handleClick={() => {}}
            />
          </Box>
        )) ||
          ''}
      </Container>
    </Fragment>
  );
};

export default DynamicLead;
