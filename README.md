# ng-spring-boot

Integrate Spring Boot Rest services to your Angular App.

## Installation

```
npm i ng-spring-boot
```

## Usage

Currently, this library supports GET with Spring Boot pagination.

### Example

Spring Boot Rest-Controller (CustomerService.java):
```Java
@RestController
@RequestMapping("/customers")
@CrossOrigin(origins = "*")
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @RequestMapping(method = RequestMethod.GET)
    public Page<Customer> listCustomers(@RequestParam(defaultValue = "") String filter, Pageable p) {
        if(filter.length() > 0) {
            return customerRepository.findByNameContaining(filter, p);
        }
        return customerRepository.findAll(p);
    }
}
```

Angular CustomerServce (customer.service.ts):
```Typescript
import { NgSpringBootService, Page, Pageable } from 'ng-spring-boot';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends NgSpringBootService {

  constructor(http: HttpClient) {
    super(http);
  }

  listCustomers(pageable?: Pageable): Observable<Page<Customer>> {
    return super.getPage<Customer>('http://localhost:8080/customers', pageable);
  }
}
```

Using CustomerService (customer-list.component.ts):
```Typescript
@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {

  page: Page<Customer>;

  constructor(private customerService: CustomerService) {
  }

  ngOnInit() {
    this.customerService.listCustomers({sort: 'name'}).subscribe(p => this.page = p);
  }

}
```

customer-list.component.html:
```HTML
<div *ngIf="page">
  <ul>
    <li *ngFor="let customer of page.content">{{customer.name}}</li>
  </ul>
</div>
```
 
