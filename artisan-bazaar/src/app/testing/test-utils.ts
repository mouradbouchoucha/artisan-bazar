import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';

// Common testing configuration
export const commonTestingConfig = {
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterTestingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
};

// Mock services
export const mockAuthService = {
  isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(true),
  login: jasmine.createSpy('login').and.returnValue(Promise.resolve(true)),
  logout: jasmine.createSpy('logout').and.returnValue(Promise.resolve()),
  getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue({ id: 1, name: 'Test User' })
};

export const mockProductService = {
  getProducts: jasmine.createSpy('getProducts').and.returnValue(Promise.resolve([])),
  getProduct: jasmine.createSpy('getProduct').and.returnValue(Promise.resolve({})),
  createProduct: jasmine.createSpy('createProduct').and.returnValue(Promise.resolve({})),
  updateProduct: jasmine.createSpy('updateProduct').and.returnValue(Promise.resolve({})),
  deleteProduct: jasmine.createSpy('deleteProduct').and.returnValue(Promise.resolve())
};

export const mockUserService = {
  getUsers: jasmine.createSpy('getUsers').and.returnValue(Promise.resolve([])),
  getUser: jasmine.createSpy('getUser').and.returnValue(Promise.resolve({})),
  updateUser: jasmine.createSpy('updateUser').and.returnValue(Promise.resolve({})),
  deleteUser: jasmine.createSpy('deleteUser').and.returnValue(Promise.resolve())
};

export const mockSearchService = {
  search: jasmine.createSpy('search').and.returnValue(Promise.resolve([])),
  getFilters: jasmine.createSpy('getFilters').and.returnValue(Promise.resolve({}))
};