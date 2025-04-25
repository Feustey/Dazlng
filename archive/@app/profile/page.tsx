"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import Button from "../../ui/button";
import { Badge } from "../../ui/badge";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "Jean Dupont",
    username: "jean.dupont",
    email: "jean.dupont@exemple.fr",
    bio: "Développeur web passionné par les technologies blockchain et les applications décentralisées.",
    skills: [
      "JavaScript",
      "React",
      "Node.js",
      "Blockchain",
      "Lightning Network",
    ],
    activities: [
      { id: 1, action: "A terminé un projet", date: "2023-05-15" },
      { id: 2, action: "A rejoint un nouveau groupe", date: "2023-05-10" },
      { id: 3, action: "A participé à un événement", date: "2023-05-01" },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Ici, vous implémenteriez la logique pour sauvegarder les modifications
    // du profil vers votre backend
    console.log("Profil sauvegardé:", profile);
    // Exemple: await fetch('/api/profile', { method: 'POST', body: JSON.stringify(profile) });
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Section d'informations du profil */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations du profil</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{profile.name}</h2>
                    <p className="text-muted-foreground">@{profile.username}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Nom
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="username" className="text-sm font-medium">
                        Nom d'utilisateur
                      </label>
                      <Input
                        id="username"
                        name="username"
                        value={profile.username}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      E-mail
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="bio" className="text-sm font-medium">
                      Biographie
                    </label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={profile.bio}
                      onChange={handleChange}
                      rows={4}
                    />
                  </div>

                  <Button onClick={handleSave}>
                    Enregistrer les modifications
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section latérale avec compétences et activités récentes */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Compétences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activité récente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profile.activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="border-b pb-3 last:border-0"
                    >
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
