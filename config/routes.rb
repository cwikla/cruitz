
module Constraint
  class Recruiter
 
    def matches?(request)
      warden(request).authenticated? && warden(request).user.is_recruiter?
    end
 
    private
 
    def warden(request)
      request.env['warden']
    end
  end

  class Admin
    def matches?(request)
      warden(request).authenticated? && warden(request).user.is_admin?
    end
 
    private
 
    def warden(request)
      request.env['warden']
    end
  end
end

Rails.application.routes.draw do

  resources :spam_reasons
  scope :api, defaults: { format: :json } do
    scope :v1 do
      post 'pusher/auth' => 'pusher#auth'

      post 'recruiters/search' => 'users#recruiter_search'
      get 'recruiters' => 'users#recruiters'
      get 'recruiters/:id' => 'users#recruiter'

      get 'candidates/:id/thread' => 'candidates#thread'
      get 'candidates/jobs' => 'candidates#jobs'

      resources :users, only: [:index, :create, :show, :update, :destroy]

        #resources :microposts, only: [:index, :create, :show, :update, :destroy]

      get 'jobs/:id(/:candidates)' => 'jobs#show'

      get 'settings' => 'settings#show'
      patch 'settings' => 'settings#update'

      post 'search(/:model)' => 'search#show'
      get 'search(/:model)' => 'search#show'


      get 'skills/auto' => 'skills#search'
      get 'locations/auto' => 'locations#search'
      get 'categories/auto' => 'categories#search'

      resources :ratings
      resources :candidates
      resources :heads
      resources :jobs
      resources :invites, only: [:new, :create]
      resources :categories
      resource :me, { controller: "me" }
      patch 'password' => 'me#password'

      get 'company' => 'companies#mine'
      patch 'company' => 'companies#mine_update'

      get 'companies/auto' => 'companies#search'
      resources :companies

      resources :uploads
      post 'uploads/make' => 'uploads#make', as: :api_v1_upload_url


      post 'messages/:id' => 'messages#create'
      get 'messages/:id/thread' => 'messages#thread'
      resources :messages
   
      post 'positions/search' => 'positions#search' 
      get 'positions/:id/candidates' => 'positions#candidates'
      resources :positions

      post 'spams/:id' => 'spams#create'

      resources :spam_reasons
    end
  end

  get 'pricing' => 'home#pricing'
  get 'about' => 'home#about'
  get 'recruit' => 'home#recruiters'


  authenticated :user do
    root 'marketplace#index', constraints: Constraint::Recruiter.new, as: :marketplace_url
    root 'dashboard#index', as: :dashboard_url
    #match "*path", to: redirect('/'), via: :all
  end


end
