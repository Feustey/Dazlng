import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  BooleanField,
  DateField,
  NumberField,
  Edit,
  Create,
  Show,
  SimpleForm,
  TextInput,
  BooleanInput,
  NumberInput,
  SimpleShowLayout,
  TopToolbar,
  EditButton,
  ShowButton,
  DeleteButton,
  useRecordContext,
} from 'react-admin';
import { Users } from 'lucide-react';

// Actions personnalisées
const ListActions = () => (
  <TopToolbar>
    {/* Ajout d'actions personnalisées si nécessaire */}
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

// Liste des clients
export const CustomerList = () => (
  <List 
    title="Clients"
    actions={<ListActions />}
    perPage={25}
    sort={{ field: 'created_at', order: 'DESC' }}
  >
    <Datagrid rowClick="show">
      <TextField source="email" label="Email" />
      <TextField source="prenom" label="Prénom" />
      <TextField source="nom" label="Nom" />
      <BooleanField source="email_verified" label="Email vérifié" />
      <NumberField source="t4g_tokens" label="Tokens T4G" />
      <DateField source="created_at" label="Inscription" />
      <RowActions />
    </Datagrid>
  </List>
  );
// Affichage détaillé d'un client
export const CustomerShow = () => (
  <Show title="Détails du client">
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <EmailField source="email" label="Email" />
      <TextField source="prenom" label="Prénom" />
      <TextField source="nom" label="Nom" />
      <BooleanField source="email_verified" label="Email vérifié" />
      <TextField source="pubkey" label="Clé publique Lightning" />
      <TextField source="compte_x" label="Compte X/Twitter" />
      <TextField source="compte_nostr" label="Compte Nostr" />
      <NumberField source="t4g_tokens" label="Tokens T4G" />
      <TextField source="node_id" label="ID du nœud" />
      <DateField source="created_at" label="Date d'inscription" />
      <DateField source="updated_at" label="Dernière mise à jour" />
      <DateField source="verified_at" label="Date de vérification" />
    </SimpleShowLayout>
  </Show>
  );
// Édition d'un client
export const CustomerEdit = () => (
  <Edit title="Modifier le client">
    <SimpleForm>
      <TextInput source="email" label="Email" type="email" fullWidth />
      <TextInput source="prenom" label="Prénom" fullWidth />
      <TextInput source="nom" label="Nom" fullWidth />
      <BooleanInput source="email_verified" label="Email vérifié" />
      <TextInput source="pubkey" label="Clé publique Lightning" fullWidth />
      <TextInput source="compte_x" label="Compte X/Twitter" fullWidth />
      <TextInput source="compte_nostr" label="Compte Nostr" fullWidth />
      <NumberInput source="t4g_tokens" label="Tokens T4G" />
      <TextInput source="node_id" label="ID du nœud" fullWidth />
    </SimpleForm>
  </Edit>
  );
// Création d'un nouveau client
export const CustomerCreate = () => (
  <Create title="Créer un client">
    <SimpleForm>
      <TextInput source="email" label="Email" type="email" required fullWidth />
      <TextInput source="prenom" label="Prénom" fullWidth />
      <TextInput source="nom" label="Nom" fullWidth />
      <BooleanInput source="email_verified" label="Email vérifié" defaultValue={false} />
      <TextInput source="pubkey" label="Clé publique Lightning" fullWidth />
      <TextInput source="compte_x" label="Compte X/Twitter" fullWidth />
      <TextInput source="compte_nostr" label="Compte Nostr" fullWidth />
      <NumberInput source="t4g_tokens" label="Tokens T4G" defaultValue={1} />
      <TextInput source="node_id" label="ID du nœud" fullWidth />
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
  options: { label: 'Clients' }
}
export const dynamic = "force-dynamic";
