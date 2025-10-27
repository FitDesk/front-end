import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

import { Input } from "@/shared/components/ui/input";
import { Image } from "@/shared/components/ui/image";
import { Label } from "@/shared/components/ui/label";
import { useRef } from "react";
import { Button } from "@/shared/components/ui/button";
import { Camera, Loader2, Pencil } from "lucide-react";
import { ImageCropDialog } from "@/shared/components/image-crop-dialog";
import { useProfileForm } from "./hooks/useProfileForm";
import { useIsEditing, useProfileActions } from "./store/profile.store";
import { ProfileSkeleton } from "./components/profile-skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";

export default function ProfilePage() {
  const {
    form,
    member,
    isLoading,
    isUpdating,
    profileImageUrl,
    imageToCrop,
    onSubmit,
    handleCancelEdit,
    handleFileChange,
    handleCropComplete,
    setImageToCrop,
  } = useProfileForm();

  const isEditing = useIsEditing();
  const { setIsEditing } = useProfileActions();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (isLoading) {
    return <ProfileSkeleton />;
  }
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
          {!isEditing && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Editar Perfil
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>
              {isEditing
                ? "Edita tu información y haz clic en 'Guardar Cambios'."
                : "Aquí puedes ver tu información personal."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <Image
                  src={profileImageUrl}
                  alt="Foto de perfil"
                  className="w-32 h-32 rounded-full object-cover border-4 border-muted shadow-lg"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUpdating}
                  aria-label="Cambiar foto de perfil"
                >
                  <Camera className="h-5 w-5" />
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly={!isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly={!isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dni"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DNI</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly={!isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly={!isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            
            </div>
          </CardContent>

          {isEditing && (
            <CardFooter className="flex justify-end gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancelEdit}
                disabled={isUpdating}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Guardar Cambios
              </Button>
            </CardFooter>
          )}
        </Card>
      </form>
      <ImageCropDialog
        imageSrc={imageToCrop}
        onClose={() => setImageToCrop(null)}
        onCropComplete={handleCropComplete}
      />
    </Form>
  );
}
