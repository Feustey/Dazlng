import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  DateField,
  NumberField,
  Edit,
  Create,
  Show,
  SimpleForm,
  TextInput,
  BooleanInput,
  SimpleShowLayout,
  TopToolbar,
  EditButton,
  ShowButton,
  DeleteButton,
  useRecordContext,
} from 'react-admin';
import { Target } from 'lucide-react';

// Actions personnalisées
const ListActions = () => (
  <TopToolbar>
    {/* Actions pour les segments */}
  </TopToolbar>
  );
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
    title="Segments de clients"
    actions={<ListActions />}
    perPage={25}
    sort={{ field: 'created_at', order: 'DESC' }}
  >
    <Datagrid rowClick="show">
      <TextField source="name" label="Nom du segment" />
      <TextField source="description" label="Description" />
      <NumberField source="member_count" label="Nombre de membres" />
      <BooleanField source="auto_update" label="Mise à jour auto" />
      <DateField source="created_at" label="Créé le" />
      <RowActions />
    </Datagrid>
  </List>
  );
// Affichage détaillé d'un segment
export const SegmentShow = () => (
  <Show title="Détails du segment">
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="name" label="Nom du segment" />
      <TextField source="description" label="Description" />
      <TextField source="criteria" label="Critères (JSON)" />
      <BooleanField source="auto_update" label="Mise à jour automatique" />
      <NumberField source="member_count" label="Nombre de membres" />
      <DateField source="created_at" label="Date de création" />
      <DateField source="updated_at" label="Dernière mise à jour" />
    </SimpleShowLayout>
  </Show>
  );
// Édition d'un segment
export const SegmentEdit = () => (
  <Edit title="Modifier le segment">
    <SimpleForm>
      <TextInput source="name" label="Nom du segment" required fullWidth />
      <TextInput source="description" label="Description" multiline rows={3} fullWidth />
      <TextInput source="criteria" label="Critères (JSON)" multiline rows={5} fullWidth />
      <BooleanInput source="auto_update" label="Mise à jour automatique" />
    </SimpleForm>
  </Edit>
  );
// Création d'un nouveau segment
export const SegmentCreate = () => (
  <Create title="Créer un segment">
    <SimpleForm>
      <TextInput source="name" label="Nom du segment" required fullWidth />
      <TextInput source="description" label="Description" multiline rows={3} fullWidth />
      <TextInput 
        source="criteria" 
        label="Critères (JSON)" 
        multiline 
        rows={5} 
        fullWidth 
        defaultValue='{"profile":{"email_verified":true}}'
      />
      <BooleanInput source="auto_update" label="Mise à jour automatique" defaultValue={true} />
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
  options: { label: 'Segments' }
}
export const dynamic = "force-dynamic";
