import React from "react";
import { FileText } from "@/components/shared/ui/IconRegistry";
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
  useRecordContext
} from "react-admin";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

// Actions personnalisées
const ListActions = () => {
  const { t } = useAdvancedTranslation("common");

  return (
    <TopToolbar>
      {/* Actions pour les templates */}
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

// Liste des templates
export const TemplateList = () => (
  <List
    perPage={25}
    sort={{ field: "created_at", order: "DESC" }}
  >
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="subject" />
      <BooleanField source="is_active" />
      <DateField source="created_at" />
      <RowActions />
    </Datagrid>
  </List>
);

// Affichage détaillé d'un template
export const TemplateShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="subject" />
      <TextField source="content" />
      <TextField source="variables" />
      <TextField source="category" />
      <BooleanField source="is_active" />
      <DateField source="created_at" />
      <DateField source="updated_at" />
    </SimpleShowLayout>
  </Show>
);

// Édition d'un template
export const TemplateEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="subject" />
      <TextInput source="content" multiline rows={10} />
      <TextInput source="variables" />
      <TextInput source="category" />
      <BooleanInput source="is_active" />
    </SimpleForm>
  </Edit>
);

// Création d'un nouveau template
export const TemplateCreate = () => {
  const defaultTemplate = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{{subject}}</title>
</head>
<body>
    <div>
        <h1 style="color: #4f46e5;">Bonjour {{prenom}} !</h1>
        <p>Contenu de votre email</p>
        <div>
            <a href="{{dashboard_url}}">
                Accéder au dashboard
            </a>
        </div>
        <p>L'équipe DazNode</p>
    </div>
</body>
</html>`;

  const defaultVariables = '{"prenom": "Prénom du client", "subject": "Sujet de \'email", "dashboard_url": "URL du dashboard"}';

  return (
    <Create>
      <SimpleForm>
        <TextInput source="name" />
        <TextInput source="subject" />
        <TextInput source="content" multiline rows={10} defaultValue={defaultTemplate} />
        <TextInput source="variables" defaultValue={defaultVariables} />
        <TextInput source="category" />
        <BooleanInput source="is_active" defaultValue={true} />
      </SimpleForm>
    </Create>
  );
};

// Configuration de la ressource
export const templateResource = {
  list: TemplateList,
  show: TemplateShow,
  edit: TemplateEdit,
  create: TemplateCreate,
  icon: FileText,
  options: { label: "Templates" }
};