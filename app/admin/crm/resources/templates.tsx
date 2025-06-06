import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  DateField,
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
import { FileText } from 'lucide-react';

// Actions personnalisées
const ListActions = () => (
  <TopToolbar>
    {/* Actions pour les templates */}
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

// Liste des templates
export const TemplateList = () => (
  <List 
    title="Templates Email"
    actions={<ListActions />}
    perPage={25}
    sort={{ field: 'created_at', order: 'DESC' }}
  >
    <Datagrid rowClick="show">
      <TextField source="name" label="Nom du template" />
      <TextField source="subject" label="Sujet par défaut" />
      <TextField source="category" label="Catégorie" />
      <BooleanField source="is_active" label="Actif" />
      <DateField source="created_at" label="Créé le" />
      <RowActions />
    </Datagrid>
  </List>
);

// Affichage détaillé d'un template
export const TemplateShow = () => (
  <Show title="Détails du template">
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="name" label="Nom du template" />
      <TextField source="subject" label="Sujet par défaut" />
      <TextField source="content" label="Contenu HTML" />
      <TextField source="variables" label="Variables disponibles (JSON)" />
      <TextField source="category" label="Catégorie" />
      <BooleanField source="is_active" label="Actif" />
      <DateField source="created_at" label="Date de création" />
      <DateField source="updated_at" label="Dernière mise à jour" />
    </SimpleShowLayout>
  </Show>
);

// Édition d'un template
export const TemplateEdit = () => (
  <Edit title="Modifier le template">
    <SimpleForm>
      <TextInput source="name" label="Nom du template" required fullWidth />
      <TextInput source="subject" label="Sujet par défaut" fullWidth />
      <TextInput source="content" label="Contenu HTML" multiline rows={15} fullWidth />
      <TextInput source="variables" label="Variables (JSON)" multiline rows={5} fullWidth />
      <TextInput source="category" label="Catégorie" fullWidth />
      <BooleanInput source="is_active" label="Template actif" />
    </SimpleForm>
  </Edit>
);

// Création d'un nouveau template
export const TemplateCreate = () => (
  <Create title="Créer un template">
    <SimpleForm>
      <TextInput source="name" label="Nom du template" required fullWidth />
      <TextInput source="subject" label="Sujet par défaut" fullWidth />
      <TextInput 
        source="content" 
        label="Contenu HTML" 
        multiline 
        rows={15} 
        fullWidth 
        defaultValue={`<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{subject}}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #4f46e5;">Bonjour {{prenom}} !</h1>
        <p>Contenu de votre email...</p>
        <div style="margin: 30px 0;">
            <a href="{{dashboard_url}}" style="background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Accéder au dashboard
            </a>
        </div>
        <p>L'équipe DazNode</p>
    </div>
</body>
</html>`}
      />
      <TextInput 
        source="variables" 
        label="Variables (JSON)" 
        multiline 
        rows={5} 
        fullWidth 
        defaultValue='{"prenom": "Prénom du client", "subject": "Sujet de email", "dashboard_url": "URL du dashboard"}'
      />
      <TextInput source="category" label="Catégorie" fullWidth defaultValue="general" />
      <BooleanInput source="is_active" label="Template actif" defaultValue={true} />
    </SimpleForm>
  </Create>
);

// Configuration de la ressource
export const templateResource = {
  list: TemplateList,
  show: TemplateShow,
  edit: TemplateEdit,
  create: TemplateCreate,
  icon: FileText,
  options: { label: 'Templates' }
}; 