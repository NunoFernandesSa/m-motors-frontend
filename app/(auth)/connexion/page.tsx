"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LoginFormValues, loginSchema } from "@/zod";

export default function LoginPage() {
  const { login, isLoading, error } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    await login(data.username, data.password);
    if (useAuthStore.getState().isAuthenticated) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Connexion à votre compte</CardTitle>
          <CardDescription>
            Entrez votre nom d&apos;utilisateur et votre mot de passe
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Nom d&apos;utilisateur</Label>
              <Input
                id="username"
                type="text"
                placeholder="john_doe"
                {...register("username")}
                aria-invalid={!!errors.username}
              />
              {errors.username && (
                <p className="text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Mot de passe oublié ?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                {...register("password")}
                aria-invalid={!!errors.password}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.push("/inscription")}
            >
              S&apos;inscrire
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
