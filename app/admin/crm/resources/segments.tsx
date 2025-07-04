import React from "react";
import { Target } from "@/components/shared/ui/IconRegistry";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  Edit,
  Create,
  Show,
  SimpleForm,
  TextInput,
  SimpleShowLayout,
  TopToolbar,
  EditButton,
  ShowButton,
  DeleteButton,
  useRecordContext,
  ChipField
} from "react-admin";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

// Actions personnalisées
const ListActions = () => {
  const { t } = useAdvancedTranslation("common");

  return (
    <TopToolbar>
      {/* Actions pour les segments */}
    </TopToolbar>
  );
};

const RowActions = () => {
  const record = useRecordContext();
  if (!record) return null;
  
  return (
    <div>
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </div>
  );
};

// Liste des segments
export const SegmentList = () => (
  <List
    perPage={25}
    sort={{ field: "created_at", order: "DESC" }}
  >
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="description" />
      <TextField source="criteria" />
      <TextField source="customer_count" />
      <DateField source="created_at" />
      <DateField source="updated_at" />
      <RowActions />
    </Datagrid>
  </List>
);

// Affichage détaillé d'un segment
export const SegmentShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="description" />
      <TextField source="criteria" />
      <TextField source="customer_count" />
      <TextField source="is_active" />
      <DateField source="created_at" />
      <DateField source="updated_at" />
    </SimpleShowLayout>
  </Show>
);

// Édition d'un segment
export const SegmentEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="description" />
      <TextInput source="criteria" />
    </SimpleForm>
  </Edit>
);

// Création d'un nouveau segment
export const SegmentCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="description" />
      <TextInput source="criteria" />
    </SimpleForm>
  </Create>
);

// Configuration de la ressource
export const segmentResource = {
  list: SegmentList,
  show: SegmentShow,
  edit: SegmentEdit,
  create: SegmentCreate,
  icon: Target,
  options: { label: "Segments" }
};
