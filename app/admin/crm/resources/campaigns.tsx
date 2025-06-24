import React from 'react';
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
  ChipField,
} from 'react-admin';
import { Send } from 'lucide-react';

// Actions personnalisées
const ListActions = () => (
  <TopToolbar>
    {/* Actions pour les campagnes */}
  </TopToolbar>
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
};
};

// Composant pour afficher le statut avec couleur
export interface StatusFieldProps {
  record?: {
  status?: string;
  [key: string]: unknown;
};
}

const StatusField = ({ record }: StatusFieldProps) => {
  if (!record) return null;
  
  const _statusColors = {
    draft: 'default',
    scheduled: 'primary',
    sending: 'warning',
    sent: 'success',
    cancelled: 'error'
  };
  
  return (
    <ChipField 
      source="status" 
      record={record}
    />
};
};

// Liste des campagnes
export const CampaignList = () => (
  <List 
    title="Campagnes Email"
    actions={<ListActions />}
    perPage={25}
    sort={{ field: 'created_at', order: 'DESC' }}
  >
    <Datagrid rowClick="show">
      <TextField source="name" label="Nom de la campagne" />
      <TextField source="subject" label="Sujet" />
      <StatusField />
      <DateField source="scheduled_at" label="Programmé pour" />
      <DateField source="sent_at" label="Envoyé le" />
      <DateField source="created_at" label="Créé le" />
      <RowActions />
    </Datagrid>
  </List>
};
// Affichage détaillé d'une campagne
export const CampaignShow = () => (
  <Show title="Détails de la campagne">
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="name" label="Nom de la campagne" />
      <TextField source="subject" label="Sujet" />
      <TextField source="content" label="Contenu HTML" />
      <TextField source="template_id" label="Template utilisé" />
      <TextField source="segment_ids" label="Segments ciblés" />
      <StatusField />
      <DateField source="scheduled_at" label="Programmé pour" />
      <DateField source="sent_at" label="Envoyé le" />
      <TextField source="stats" label="Statistiques (JSON)" />
      <TextField source="created_by" label="Créé par" />
      <DateField source="created_at" label="Date de création" />
      <DateField source="updated_at" label="Dernière mise à jour" />
    </SimpleShowLayout>
  </Show>
};
// Édition d'une campagne
export const CampaignEdit = () => (
  <Edit title="Modifier la campagne">
    <SimpleForm>
      <TextInput source="name" label="Nom de la campagne" required fullWidth />
      <TextInput source="subject" label="Sujet" required fullWidth />
      <TextInput source="content" label="Contenu HTML" multiline rows={10} fullWidth />
      <TextInput source="template_id" label="Template ID" fullWidth />
      <TextInput source="segment_ids" label="Segments (IDs séparés par des virgules)" fullWidth />
    </SimpleForm>
  </Edit>
};
// Création d'une nouvelle campagne
export const CampaignCreate = () => (
  <Create title="Créer une campagne">
    <SimpleForm>
      <TextInput source="name" label="Nom de la campagne" required fullWidth />
      <TextInput source="subject" label="Sujet" required fullWidth />
      <TextInput 
        source="content" 
        label="Contenu HTML" 
        multiline 
        rows={10} 
        fullWidth 
        defaultValue='<html><body><h1>Bonjour {{prenom}},</h1><p>Contenu de votre email...</p></body></html>'
      />
      <TextInput source="template_id" label="Template ID" fullWidth />
      <TextInput source="segment_ids" label="Segments (IDs séparés par des virgules)" fullWidth />
    </SimpleForm>
  </Create>
};
// Configuration de la ressource
export const campaignResource = {
  list: CampaignList,
  show: CampaignShow,
  edit: CampaignEdit,
  create: CampaignCreate,
  icon: Send,
  options: { label: 'Campagnes' }
}
