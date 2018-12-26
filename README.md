# ng-spring-boot

Integrate Spring Boot Rest services to your Angular App.

## Installation

```
npm i ng-spring-boot
```

## Usage

Supported Operations:

* GET with pagination
* POST a new resource and read the location-header and new resource-id
 
### Example

#### GET with pagination

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

#### POST a new resource

Spring Boot Rest-Controller (CustomerService.java):
```Java
@RestController
@RequestMapping("/customers")
@CrossOrigin(origins = "*")
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity addCustomers(@RequestBody Customer customer) {
        Integer newCustomerId = customerRepository.saveAndFlush(customer).getId();
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .header("Location", recipeId + "/customers/" + newCustomerId)
                .build();
    }
}
```

To enable the Location header with CORS, you need additional configuration:

```Java
@Configuration
public class WebConfig{

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("*")
                        .allowedMethods("PUT", "POST", "DELETE")
                        .allowedHeaders("Location", "Content-Type")
                        .exposedHeaders("Location", "Content-Type");
            }
        };
    }
}
```

Usage (customer.service.ts)

```Typescript
  saveCustomer(customer: Customer): Observable<number> {
    return super.postResource('http://localhost:8080/customers', customer).pipe(
      switchMap(r => {
        return of(+r.id);
      })
    );
  }
```
