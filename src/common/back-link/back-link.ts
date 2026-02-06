import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-back-link',
  imports: [RouterLink],
  templateUrl: './back-link.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackLink {
  href = input.required<string>();
}
