/**
 * @license: MIT
 * @author: nuno fernandes
 * @Copyright (c) 2026 m-motors. All rights reserved.
 */

// ----- Shadcn UI -----
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
// ----- Icons -----
import { AlertTriangle } from "lucide-react";
import { JSX } from "react";
import { ErrorMessageProps } from "@/types";

/**
 * ErrorMessage component that displays an error message to the user with an optional retry button
 * @param {Object} props - The component props
 * @param {string} props.message - The error message to display
 * @param {function} [props.onRetry] - Optional function to call when the retry button is clicked
 * @returns {JSX.Element} The rendered ErrorMessage component
 */
export function ErrorMessage({
  message,
  onRetry,
}: ErrorMessageProps): JSX.Element {
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
