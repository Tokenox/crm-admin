import { Button, Container, Grid } from '@mui/material';
import { Box, Stack } from '@mui/system';
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AddCategory from '../components/add-category/AddCategory';
import AddLead, { leadsInitialState } from '../components/add-lead/AddLead';
import CustomInput from '../components/input/CustomInput';
import LeadsTable from '../components/leads-table/LeadsTable';
import CustomModal from '../components/modals/CustomModal';
import CsvUpload from '../components/upload-file/CsvUpload';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { createCategory, getCategories, getCategory } from '../redux/middleware/category';
import { createBulkLead, createLead, getLeads } from '../redux/middleware/lead';
import { categoryByIdSelector, categorySelector } from '../redux/slice/categorySlice';
import { leadState, openModal } from '../redux/slice/leadSlice';
import { CategoryResponseTypes, CategoryTypes, FieldTypes } from '../types';
import createAbortController from '../utils/createAbortController';

type AddNewColumnsTypes = {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date';
};
const initialCategoryState = {
  name: '',
  description: ''
};
const initialFieldState = {
  name: '',
  type: ''
};

const DynamicLead = () => {
  const categories: CategoryResponseTypes[] = useAppSelector(categorySelector);
  const categoryData: CategoryResponseTypes = useAppSelector(categoryByIdSelector);
  const { data, isModalOpen } = useAppSelector(leadState);
  const dispatch = useAppDispatch();
  const { signal, abort } = createAbortController();

  const [selected, setSelected] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [uploadedLeads, setUploadedLeads] = useState([]);
  const [uploadedLeadsCols, setUploadedLeadsCols] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  // const [addNewLead, setAddNewLead] = useState([leadsInitialState]);
  const [addNewColumns, setAddNewColumns] = useState<AddNewColumnsTypes[]>([
    {
      name: 'name',
      type: 'string'
    }
  ]);
  // const [addNewLeadData, setAddNewLeadData] = useState({});
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [category, setCategory] = useState<CategoryTypes>(initialCategoryState);
  const [fields, setFields] = useState<FieldTypes[]>([initialFieldState]);
  const [addLeads, setAddLeads] = useState<any>(categoryData?.fields);
  const [leadValues, setLeadValues] = useState({});

  useEffect(() => {
    if (!categoryData) return;
    const updatedFields = categoryData.fields.map((field) => {
      return {
        ...field,
        value: ''
      };
    });
    setAddLeads(updatedFields);
  }, [categoryData]);

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
    // const keys = Object.keys(data[data.length - 2]);
    // keys.forEach((key) => {
    //   columns.push({
    //     name: key,
    //     type: 'string'
    //   });
    // });
    return [
      { name: 'name', type: 'string', alignRight: false },
      { name: 'email', type: 'string', alignRight: false },
      { name: 'phone', type: 'string', alignRight: false },
      { name: 'Address', type: 'string', alignRight: false }
    ];
  }, []);

  const handleRequestSort = (event, property) => {
    // const isAsc = orderBy === property && order === 'asc';
    // setOrder(isAsc ? 'desc' : 'asc');
    // setOrderBy(property);
  };

  // const handleAddNewLead = () => {
  //   const updatedLead = [...addNewLead];
  //   updatedLead.push({
  //     fieldName: '',
  //     type: '',
  //     value: ''
  //   });
  //   const updatedColumns = [...addNewColumns];
  //   updatedColumns.push({
  //     name: '',
  //     type: 'string'
  //   });
  //   setAddNewLead(updatedLead);
  //   setAddNewColumns(updatedColumns);
  // };

  const addNewField = () => {
    const updatedField = [...fields];
    updatedField.push({
      name: '',
      type: ''
    });
    setFields(updatedField);
  };

  const removeField = (index) => {
    const updatedField = [...fields];
    updatedField.splice(index, 1);
    setFields(updatedField);
  };

  const getAddLeadData = (value, name, index) => {
    const updatedData = [...addLeads];
    updatedData[index]['value'] = value;
    setAddLeads(updatedData);
    const data = {
      ...leadValues,
      [updatedData[index]['name']]: value
    };
    setLeadValues(data);
  };

  const getFieldsData = (value, name, index) => {
    const updatedField = [...fields];
    updatedField[index][name] = value;
    setFields(updatedField);
  };

  const submitAddNewLead = () => {
    const data = {
      tableId: selectedCategory,
      columns: addNewColumns,
      data: leadValues
    };
    dispatch(createLead({ lead: data, signal }));
    // reset the state
    setAddNewColumns([
      {
        name: 'name',
        type: 'string'
      }
    ]);
    setIsAddLeadModalOpen(false);
  };

  const submitCategory = async () => {
    debugger;
    try {
      const formattedData = {
        name: category.name,
        description: category.description || '',
        fields: fields
      };
      await dispatch(createCategory({ category: formattedData }));
      setIsCategoryModalOpen(false);
      setCategory(initialCategoryState);
      setFields([initialFieldState]);
    } catch (error) {
      console.log('Error:(', error);
    }
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
                  dispatch(getCategory({ id: category.id }));
                  dispatch(getLeads({ categoryId: category.id, signal }));
                }}
              >
                {category.name}
              </Button>
            ))) ||
            ''}
        </Stack>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={() => setIsCategoryModalOpen(true)} variant="contained">
            Add Category
          </Button>
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
            title={categoryData?.name || 'Add Lead'}
            open={isAddLeadModalOpen}
            setOpen={() => setIsAddLeadModalOpen(false)}
            handleSubmit={submitAddNewLead}
          >
            <AddLead
              // leadValue={addNewLead}
              leadValue={addLeads}
              getAddLeadData={getAddLeadData}
              // addNewLead={handleAddNewLead}
              // selectedCategory={selectedCategory}
              // setSelectedCategory={(value) => setSelectedCategory(value)}
            />
          </CustomModal>
        </Box>
        <Box>
          <CustomModal
            title="Add Category"
            open={isCategoryModalOpen}
            setOpen={() => setIsCategoryModalOpen(false)}
            handleSubmit={submitCategory}
          >
            <AddCategory
              fields={fields}
              getFieldsData={getFieldsData}
              addNewField={addNewField}
              category={category}
              setCategory={setCategory}
            />
          </CustomModal>
        </Box>
        {categoryData && categoryData.fields && categoryData.fields.length && (
          <Box>
            <LeadsTable
              data={data}
              headLabel={categoryData.fields}
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
        )}
      </Container>
    </Fragment>
  );
};

export default DynamicLead;
