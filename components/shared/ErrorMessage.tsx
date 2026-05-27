import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";

export function ErrorMessage({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <Card className="max-w-md mx-auto mt-20 text-center border-destructive/50 shadow-lg">
      <CardHeader>
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-3">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
        </div>
        <CardTitle className="text-destructive">Oups !</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{message}</p>
      </CardContent>
      {onRetry && (
        <CardFooter className="flex justify-center">
          <Button variant="outline" onClick={onRetry}>
            Réessayer
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
