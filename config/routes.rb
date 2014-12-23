Rails.application.routes.draw do
  root 'home#index'

  devise_for :mongoid_users, path: '/users',controllers: {
    sessions: 'sessions',
    passwords: 'passwords',
    registrations: 'registrations'
  }

end
