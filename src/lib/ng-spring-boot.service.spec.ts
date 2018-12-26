import { TestBed } from '@angular/core/testing';

import { NgSpringBootService } from './ng-spring-boot.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('NgSpringBootService', () => {

  let httpMock: HttpTestingController;
  let service: NgSpringBootService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.get(NgSpringBootService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call the backend with all parameters', () => {
    service.getPage('/some/url', {page: 1, size: 3, sort: 'name', sortDir: 'DESC', filter: 'bla'}).subscribe(() => {});
    const req = httpMock.expectOne('/some/url?page=1&size=3&sort=name;DESC&filter=bla');
    expect(req.request.method).toEqual('GET');
  });

  it('should call the backend with all parameters appended to existing params', () => {
    service.getPage('/some/url?existing=param&another=param2', {page: 1, size: 3, sort: 'name', sortDir: 'DESC', filter: 'bla'}).subscribe(() => {});
    const req = httpMock.expectOne('/some/url?existing=param&another=param2&page=1&size=3&sort=name;DESC&filter=bla');
    expect(req.request.method).toEqual('GET');
  });

  it('should return the location and id when doing a postResource', () => {
    const id = 5;
    const loc = 'resource/' + id;
    service.postResource('/some/url', {}).subscribe(r => expect(r).toEqual({location: loc, id: id}));
    const req = httpMock.expectOne('/some/url');
    expect(req.request.method).toEqual('POST');
    req.flush(null, {headers: {'Location' : loc}});
  });

  afterEach(() => {
    httpMock.verify();
  });
});
