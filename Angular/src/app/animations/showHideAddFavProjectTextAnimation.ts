import { trigger, state, style, transition,
    animate, group, query, stagger, keyframes
} from '@angular/animations';

export const ShowHideAddFavProjectAnimation = [
    trigger('showHideAddFavProject', [
        state('show', style({
            'display': 'inline-block', 'opacity': '1', 'font-size': '1rem'
        })),
        state('hide', style({
            'display': 'none', 'opacity': '0'
        })),
        transition('show => hide', [group([
            animate('50ms ease-in-out', style({
                'display': 'none', 'opacity': '0'
            }))
        ]
        )]),
        transition('hide => show', [group([
            animate('400ms ease-in-out', style({
                'display': 'inline-block', 'opacity': '1'
            }))
        ]
        )])
    ]),
]