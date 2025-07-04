import React from "react";
import { Users } from "@/components/shared/ui/IconRegistry";
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
      {/* Actions pour les clients */}
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

// Liste des clients
export const CustomerList = () => (
  <List
    perPage={25}
    sort={{ field: "created_at", order: "DESC" }}
  >
    <Datagrid>
      <TextField source="id" />
      <TextField source="email" />
      <TextField source="nom" />
      <TextField source="prenom" />
      <TextField source="pubkey" />
      <DateField source="created_at" />
      <DateField source="updated_at" />
      <RowActions />
    </Datagrid>
  </List>
);

// Affichage détaillé d'un client
export const CustomerShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="email" />
      <TextField source="nom" />
      <TextField source="prenom" />
      <TextField source="pubkey" />
      <TextField source="compte_x" />
      <TextField source="compte_nostr" />
      <TextField source="t4g_tokens" />
      <TextField source="node_id" />
      <TextField source="email_verified" />
      <TextField source="verified_at" />
      <DateField source="created_at" />
      <DateField source="updated_at" />
    </SimpleShowLayout>
  </Show>
);

// Édition d'un client
export const CustomerEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="email" />
      <TextInput source="nom" />
      <TextInput source="prenom" />
      <TextInput source="pubkey" />
      <TextInput source="compte_x" />
      <TextInput source="compte_nostr" />
      <TextInput source="node_id" />
      <TextInput source="t4g_tokens" />
    </SimpleForm>
  </Edit>
);

// Création d'un nouveau client
export const CustomerCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="email" />
      <TextInput source="nom" />
      <TextInput source="prenom" />
      <TextInput source="pubkey" />
      <TextInput source="compte_x" />
      <TextInput source="compte_nostr" />
      <TextInput source="node_id" />
      <TextInput source="t4g_tokens" />
    </SimpleForm>
  </Create>
);

// Configuration de la ressource
export const customerResource = {
  list: CustomerList,
  show: CustomerShow,
  edit: CustomerEdit,
  create: CustomerCreate,
  icon: Users,
  options: { label: "Clients" }
};
